import _ from 'lodash';
import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import {allYears, showCount} from './constants';

const dataFile = require('../static/data.json');

export function* fetchAlbums(getState) {
  try {
    yield put({type: 'FETCH_ALBUMS_STARTED'})
    const albums = yield call(() =>
      fetch(dataFile).then(response => response.json()));
    yield put({type: 'FETCH_ALBUMS_SUCCEEDED', albums});

    const state = getState();
    const selectedAlbums = _randomSelect(state.albums, state.years);
    yield put({type: 'SELECTED_ALBUMS', selectedAlbums});
  } catch (e) {
    yield put({type: 'FETCH_ALBUMS_FAILED', message: e.message});
  }
};

export function* selectAlbumsByYears(getState) {
  yield* takeEvery('TOGGLE_YEAR', () => randomSelect(getState()));
}

function* randomSelect(state) {
  const selectedAlbums = _randomSelect(state.albums, state.years);
  yield put({ type: 'SELECTED_ALBUMS', selectedAlbums });
};

function  _randomSelect(albums, years) {
  years = years.length > 0 ? years : allYears;
  const selectedAlbums = new Map(
    _.toPairs(albums)
    .filter(([id, album]) => _.some(years.map(year => {
      const release_year = new Date(Date.parse(album.release_date)).getFullYear();
      const diff = release_year - year;
      return 0 <  diff && diff <  10;})))
    .sort(x => 0.5 - Math.random())
    .slice(0, showCount));
  return selectedAlbums;
};
