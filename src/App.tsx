import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Layout, Menu } from "antd"
import Home from './pages/home';
import styles from "./App.module.less"

const { Header, Content, Footer } = Layout

const menu = [{
  label: '发现',
  path: '/home'
}, {
  label: '歌单',
  path: '/sheet'
}]

function App() {

  const renderMenuItem = () => {
    return menu.map((item, index) => {
      return <Menu.Item key={index}>{item.label}</Menu.Item>
    })
  }

  return (
    <Router>
      <div className={styles.app}>
        <Layout className={styles.layout}>
          <Header className={styles.header}>
            <div className={styles.wrap}>
              <div className={styles.left}>
                <h1 className={styles.logo}>Music</h1>
                <Menu mode='horizontal' className={styles.mainMenu} theme='dark'>
                  {renderMenuItem()}
                </Menu>
              </div>
              <div className={styles.right}>
                <div>search</div>
                <div className={styles.member}>

                </div>
              </div>
            </div>
          </Header>
          <Content>Content</Content>
          <Footer>Footer</Footer>
        </Layout>
        <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
        {/**配置路由 */}
        <Route path="/home" component={Home}></Route>
      </div>
    </Router>
  );
}

export default App;
