import React from 'react';
import ReactDOM from 'react-dom';
import "antd/dist/antd.min.css"
import './index.less';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist'

//let persistor = persistStore(store)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {/*<PersistGate persistor={persistor}>
        <App />
</PersistGate>*/}
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
