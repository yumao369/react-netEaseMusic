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
import { SearchResult, User } from "./types/GlobalTypes";
import { isEmptyObject } from "./utils/tools";
import WyLayerModal from "./components/wyUi/wyLayer/wyLayerModal";
import WyLayerDefault from "./components/wyUi/wyLayer/wyLayerDefault";
import WyLayerLogin from "./components/wyUi/wyLayer/wyLayerLogin";
import WyLayerRegister from "./components/wyUi/wyLayer/wyLayerRegister";
import { controlModal } from "./services/batchAction.service";
import { ModalTypes } from "./redux/memberSlice";
import { getUserDetail, logout } from "./services/member.service";
import { AppContext } from "./context/appContext";

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

function App() {
  /*const history = useHistory()

  const handleRouteJump = (path: string) => {
    console.log('history', history)
    history.push({
      pathname: path
    })
  }*/

  const { onLogOut } = useContext(AppContext)
  const { uid } = useContext(AppContext)

  const [searchInput, setSearchInput] = useState<string>('')
  const [searchResult, setSearchResult] = useState<SearchResult>({})
  const [user, setUser] = useState<User | null>(null)



  useEffect(() => {
    getUDetail()
  }, [uid])

  useEffect(() => {
    onSearch()
  }, [searchInput])

  const getUDetail = async () => {
    if (uid) {
      const user = await getUserDetail(uid)
      setUser(user)
    } else {
      setUser(null)
    }
  }

  const onSearch = async () => {
    if (searchInput) {
      const data = await search(searchInput)
      const highLightedData = highlightKeyWords(searchInput, data)
      setSearchResult(highLightedData)
    }
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

  const handleLogin = () => {
    controlModal(true, ModalTypes.LoginByPhone)
  }

  const handleRegister = () => {
    controlModal(true, ModalTypes.Register)
  }

  const renderMenuItem = () => {
    return menu.map((item, index) => {
      return <Menu.Item key={index} >
        <Link to={{ pathname: `${item.path}` }}>{item.label}</Link>
      </Menu.Item>;
    });
  };

  const renderMember = () => {
    console.log('user', user)
    if (!user) {
      return (
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
    } else {
      return (
        <div className={styles.login}>
          <Menu mode="horizontal" theme="dark">
            <SubMenu title={
              <div>
                <Avatar src={user.profile.avatarUrl} />
                <i><DownOutlined /></i>
              </div>
            }
              key='log'>
              <Menu.Item icon={<MobileOutlined />} key={"sign up"} >
                个人中心
              </Menu.Item>
              <Menu.Item icon={<UserAddOutlined />} key={"sign in"} onClick={onLogOut}>
                登出
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      )
    }
  }

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
                <div className={styles.member}>
                  {renderMember()}
                </div>
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
          </Content>
          <Footer className={styles.footer}>
            Ant Design ©2022 Implement By React
          </Footer>
        </Layout>
      </div>
      <WyPlayer />
      <WyLayerModal default={<WyLayerDefault />} login={<WyLayerLogin />} register={<WyLayerRegister />} />
    </Router>
  );
}

export default App;
