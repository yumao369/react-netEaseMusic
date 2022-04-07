import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import Home from './pages/home';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
        {/**配置路由 */}
        <Route path="/home" component={Home}></Route>
      </div>
    </Router>
  );
}

export default App;
