import React from 'react';
import ReactDOM from 'react-dom';
import 'css/loading.css';
import 'tui-grid/dist/tui-grid.css';
import 'react-day-picker/lib/style.css';
import 'css/custom.css';
import 'css/customcust.css';
import Main from 'main/Main';
import * as serviceWorker from 'serviceWorker';
// import {Promise} from "bluebird";

window.onresize = function (evt) {
  document.getElementById('root').style.height = (window.innerHeight-18) + 'px';
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
