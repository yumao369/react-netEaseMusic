import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Layout, Menu, Input } from "antd";
import { MobileOutlined, UserAddOutlined } from "@ant-design/icons";
import Home from "./pages/home";
import styles from "./App.module.less";
import WyPlayer from "./components/wyUi/wyPlayer";

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
  const renderMenuItem = () => {
    return menu.map((item, index) => {
      return <Menu.Item key={index}>{item.label}</Menu.Item>;
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
                <Search placeholder="歌单/歌手/歌曲" enterButton />
                <div className={styles.member}>
                  <div className={styles.noLogin}>
                    <Menu mode="horizontal" theme="dark">
                      <SubMenu title="登陆">
                        <Menu.Item icon={<MobileOutlined />}>
                          手机登陆
                        </Menu.Item>
                        <Menu.Item icon={<UserAddOutlined />}>注册</Menu.Item>
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
          </Content>
          <Footer className={styles.footer}>
            Ant Design ©2022 Implement By React
          </Footer>
        </Layout>
      </div>
      <WyPlayer />
    </Router>
  );
}

export default App;
