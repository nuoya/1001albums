import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { app } from './reducers';
import { App } from './containers';
import { fetchAlbums } from './sagas';

let store = createStore(
  app,
  applyMiddleware(createSagaMiddleware(fetchAlbums))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('container')
)
