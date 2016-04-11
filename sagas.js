import { call, put } from 'redux-saga/effects'

const dataFile = require('./static/data.json');

function fetchAlbumsApi(url) {
  return fetch(url).then(response => response.json());
}

export function* fetchAlbums(action) {
  try {
    yield put({type: 'ALBUMS_FETCH_STARTED'})
    const albums = yield call(fetchAlbumsApi, dataFile);
    yield put({type: 'ALBUMS_FETCH_SUCCEEDED', albums});
  } catch (e) {
    yield put({type: 'ALBUMS_FETCH_FAILED', message: e.message});
  }
};

// function* selectAlbums(action) {
  
//   _randomPick(albums, years) {
//     years = years.length > 0 ? years : this.props.allYears;
//     const pickedAlbums = _.toPairs(albums)
//       .filter(([id, album]) => _.some(years.map(year => {
//         const release_year = new Date(Date.parse(album.release_date)).getFullYear();
//         const diff = release_year - year;
//         return 0 <  diff && diff <  10;})))
//       .sort(x => 0.5 - Math.random())
//       .slice(0, this.props.count);
//     return pickedAlbums.map(
//       ([id, album]) => [id, Object.assign({isSelected: false}, album)]);
//   }
// };
