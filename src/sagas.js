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


const getYear = (date) => new Date(Date.parse(date)).getFullYear();


function  _randomSelect(albums, years) {
  years = years.length > 0 ? years : allYears;
  const selectedAlbums = new Map(
    Object.keys(albums)
      .map(key => [key, albums[key]])
      .map(([id, album]) => [id, Object.assign(
        {}, album, {releaseYear: getYear(album['release_date'])})])
      .filter(([id, album]) => years.filter(year => {
        const diff = album.releaseYear - year;
        return 0 <  diff && diff <  10;}).length > 0)
      .sort(x => 0.5 - Math.random())
      .slice(0, showCount));
  return selectedAlbums;
};
