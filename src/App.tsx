import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect, useHistory, Link } from "react-router-dom";
import { Layout, Menu, Input, Avatar, message } from "antd";
import { MobileOutlined, UserAddOutlined, DownOutlined } from "@ant-design/icons";
import Home from "./pages/home";
import styles from "./App.module.less";
import WyPlayer from "./components/wyUi/wyPlayer";
import Sheet from "./pages/sheetList";
import SheetInfo from "./pages/sheetInfo";
import { SongInfo } from "./pages/songInfo";
import { SingerDetailCom } from "./pages/singerDetail";
import WySearch from "./components/wyUi/wySearch";
import { search } from "./services/search.service";
import { CreateSheetResponse, LikeSongParams, SearchResult, User, UserSheet } from "./types/GlobalTypes";
import { isEmptyObject } from "./utils/tools";
import WyLayerModal from "./components/wyUi/wyLayer/wyLayerModal";
import WyLayerDefault from "./components/wyUi/wyLayer/wyLayerDefault";
import WyLayerLogin from "./components/wyUi/wyLayer/wyLayerLogin";
import WyLayerRegister from "./components/wyUi/wyLayer/wyLayerRegister";
import { controlModal, likeSong } from "./services/batchAction.service";
import { ModalTypes, selectLikeId, selectShareInfo, setModalVisible, ShareInfo } from "./redux/memberSlice";
import { addLikeSong, createSheet, getUserDetail, getUserSheets, logout, ShareParams, shareResource } from "./services/member.service";
import { AppContext } from "./context/appContext";
import MyCenter from "./pages/member/myCenter";
import RecordDetail from "./pages/member/recordDetail";
import WyLayerLike from "./components/wyUi/wyLayer/wyLayerLike";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import WyLayerShare from "./components/wyUi/wyLayer/wyLayerShare";

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const menu = [
  {
    label: "发现",
    path: "/home",
  },
  {
    label: "歌单",
    path: "/sheet",
  },
];

interface MemberProps {
  uid: string | null | undefined;
  onLogOut: (() => Promise<void>) | undefined;
  user: User | null
}

function Member(props: MemberProps) {
  const history = useHistory()

  const handleLogin = () => {
    controlModal(true, ModalTypes.LoginByPhone)
  }

  const handleRegister = () => {
    controlModal(true, ModalTypes.Register)
  }

  const handleMyCenterRouteJump = () => {
    history.push(`/member/${props.uid}`)
  }

  return (
    <div className={styles.member}>
      {
        props.user ? (
          <div className={styles.login}>
            <Menu mode="horizontal" theme="dark">
              <SubMenu title={
                <div>
                  <Avatar src={props.user.profile.avatarUrl} />
                  <i><DownOutlined /></i>
                </div>
              }
                key='log'>
                <Menu.Item icon={<MobileOutlined />} key={"sign up"} onClick={handleMyCenterRouteJump}>
                  个人中心
                </Menu.Item>
                <Menu.Item icon={<UserAddOutlined />} key={"sign in"} onClick={props.onLogOut}>
                  登出
                </Menu.Item>
              </SubMenu>
            </Menu>
          </div>
        ) : (
          <div className={styles.noLogin}>
            <Menu mode="horizontal" theme="dark">
              <SubMenu title="登陆" key="log">
                <Menu.Item icon={<MobileOutlined />} key={"sign up"} onClick={handleLogin}>
                  手机登陆
                </Menu.Item>
                <Menu.Item icon={<UserAddOutlined />} key={"sign in"} onClick={handleRegister}>
                  注册
                </Menu.Item>
              </SubMenu>
            </Menu>
          </div>
        )
      }

    </div>
  )
}

function App() {

  const dispatch = useAppDispatch()

  const { onLogOut } = useContext(AppContext)
  const { uid } = useContext(AppContext)

  const [searchInput, setSearchInput] = useState<string>('')
  const [searchResult, setSearchResult] = useState<SearchResult>({})
  const [user, setUser] = useState<User | null>(null)
  const [userSheet, setUserSheet] = useState<UserSheet | null>(null)

  const likeId = useAppSelector(selectLikeId)
  const shareInfo = useAppSelector(selectShareInfo)

  useEffect(() => {
    getUDetail()
  }, [uid])

  useEffect(() => {
    watchShareInfo()
  }, [shareInfo])

  useEffect(() => {
    onSearch()
  }, [searchInput])

  const openModal = (type: ModalTypes) => {
    controlModal(true, type)
  }

  const getUDetail = async () => {
    if (uid) {
      const user = await getUserDetail(uid)
      setUser(user)
    } else {
      setUser(null)
    }
  }

  const loadMySheets = async () => {
    if (user) {
      const sheets = await getUserSheets(user.profile.userId.toString())
      setUserSheet(sheets)
      dispatch(setModalVisible({ modalVisible: true }))
    } else {
      openModal(ModalTypes.Default)
    }
  }

  const onLikeSong = async (args: LikeSongParams) => {
    const res = await addLikeSong(args)
    /**
     * problem:
     * the code below can be encapsulated as a function
     * which is responsible for handling the response 
     * form server.
     * status:
     * NOT SOLVED
     */
    if (res.code !== 200) {
      message.error(`${res.msg || '登录失败'}`)
    } else {
      controlModal(false)
      message.success('收藏成功')
    }
  }

  const onCreateSheet = async (sheetName: string) => {
    const res = await createSheet<CreateSheetResponse>(sheetName)
    console.log('res', res)
    if (res.code !== 200) {
      message.error(`${res.msg || '创建失败'}`)
    } else {
      message.success('创建成功')
      onLikeSong({ pid: res.id, tracks: likeId })
    }
  }

  const onShare = async (arg: ShareParams) => {
    const res = await shareResource(arg)
    console.log('res', res)
    if (res.code !== 200) {
      message.error(`${res.message || '分享失败'}`)
    } else {
      controlModal(false)
      message.success('分享成功')
    }
  }

  const watchShareInfo = () => {
    if (shareInfo) {
      openModal(ModalTypes.Share)
    }
  }

  const onSearch = async () => {
    if (searchInput) {
      const data = await search(searchInput)
      const highLightedData = highlightKeyWords(searchInput, data)
      setSearchResult(highLightedData)
    }
  }

  const onCloseModal = () => {
    controlModal(false)
  }

  const highlightKeyWords = (keywords: string, result: SearchResult): SearchResult => {
    if (!isEmptyObject(result)) {
      const reg = new RegExp(keywords, 'ig');
      if (result['artists']) {
        result['artists'].forEach(item => {
          item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
        })
      }
      if (result['playlists']) {
        result['playlists'].forEach(item => {
          item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
        })
      }
      if (result['songs']) {
        result['songs'].forEach(item => {
          item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
        })
      }
    }
    return result
  }

  const getSearchInput = (input: string) => {
    setSearchInput(input)
  }

  const renderMenuItem = () => {
    return menu.map((item, index) => {
      return <Menu.Item key={index} >
        <Link to={{ pathname: `${item.path}` }}>{item.label}</Link>
      </Menu.Item>;
    });
  };


  return (
    <Router>
      <div className={styles.app}>
        <Layout className={styles.layout}>
          <Header className={styles.header}>
            <div className={styles.wrap}>
              <div className={styles.left}>
                <h1 className={styles.logo}>Music</h1>
                <Menu
                  mode="horizontal"
                  className={styles.mainMenu}
                  theme="dark"
                >
                  {renderMenuItem()}
                </Menu>
              </div>
              <div className={styles.right}>
                <WySearch getSearchInput={getSearchInput} searchResult={searchResult} />
                <Member uid={uid} user={user} onLogOut={onLogOut} />
              </div>
            </div>
          </Header>
          <Content className={styles.content}>
            <Route
              exact
              path="/"
              render={() => <Redirect to="/home" />}
            ></Route>
            <Route path="/home" component={Home} />
            <Route path="/sheet" component={Sheet} />
            <Route path="/sheetInfo/:id" component={SheetInfo} />
            <Route path="/songInfo/:id" component={SongInfo} />
            <Route path="/singer/:id" component={SingerDetailCom} />
            <Route path="/member/:id" component={MyCenter} />
            <Route path="/records/:id" component={RecordDetail} />
          </Content>
          <Footer className={styles.footer}>
            Ant Design ©2022 Implement By React
          </Footer>
        </Layout>
      </div>
      <WyPlayer />
      <WyLayerModal
        loadMySheets={loadMySheets}
        default={<WyLayerDefault />}
        login={<WyLayerLogin />}
        register={<WyLayerRegister />}
        like={<WyLayerLike likeId={likeId} sheet={userSheet} onLikeSong={onLikeSong} onCreateSheet={onCreateSheet} />}
        share={<WyLayerShare shareInfo={shareInfo} onCancel={onCloseModal} onShare={onShare} />}
      />
    </Router>
  );
}

export default App;
