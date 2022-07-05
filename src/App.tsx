import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect, useHistory, Link } from "react-router-dom";
import { Layout, Menu, Input } from "antd";
import { MobileOutlined, UserAddOutlined } from "@ant-design/icons";
import Home from "./pages/home";
import styles from "./App.module.less";
import WyPlayer from "./components/wyUi/wyPlayer";
import Sheet from "./pages/sheetList";
import SheetInfo from "./pages/sheetInfo";
import { SongInfo } from "./pages/songInfo";
import { SingerDetailCom } from "./pages/singerDetail";
import WySearch from "./components/wyUi/wySearch";
import { search } from "./services/search.service";
import { SearchResult } from "./types/GlobalTypes";
import { isEmptyObject } from "./utils/tools";
import WyLayerModal from "./components/wyUi/wyLayer/wyLayerModal";
import WyLayerDefault from "./components/wyUi/wyLayer/wyLayerDefault";

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

  const [searchInput, setSearchInput] = useState<string>('')
  const [searchResult, setSearchResult] = useState<SearchResult>({})

  useEffect(() => {
    onSearch()
  }, [searchInput])

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
                <div className={styles.member}>
                  <div className={styles.noLogin}>
                    <Menu mode="horizontal" theme="dark">
                      <SubMenu title="登陆" key={"login"}>
                        <Menu.Item icon={<MobileOutlined />} key={"sign up"}>
                          手机登陆
                        </Menu.Item>
                        <Menu.Item icon={<UserAddOutlined />} key={"sign in"}>
                          注册
                        </Menu.Item>
                      </SubMenu>
                    </Menu>
                  </div>
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
      <WyLayerModal>
        <WyLayerDefault></WyLayerDefault>
      </WyLayerModal>
    </Router>
  );
}

export default App;
