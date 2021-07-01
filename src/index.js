import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./store/reducers";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import './index.scss';
import App from './App';

export const store = createStore(
  rootReducer,
  composeWithDevTools()
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode> */}
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
