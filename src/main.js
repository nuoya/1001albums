import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { app } from './reducers';
import { App } from './containers';
import { fetchAlbums, selectAlbumsByYears } from './sagas';

let store = createStore(
  app,
  compose(
    applyMiddleware(createSagaMiddleware(fetchAlbums, selectAlbumsByYears)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('container')
)
