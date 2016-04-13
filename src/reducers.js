import { combineReducers } from 'redux';

const years = (state = [], action) => {
  switch (action.type) {
    case 'TOGGLE_YEAR':
      const clone = state.slice();
      const index = clone.indexOf(action.year);
      if (index == -1) {
        clone.push(action.year);
      } else {
        clone.splice(index, 1);
      }
      return clone;
    default:
      return state;
  }
};

const albums = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_ALBUMS_SUCCEEDED':
      return action.albums;
    default:
      return state;
  }
};

const selectedAlbums = (state = [], action) => {
  switch (action.type) {
    case 'TOGGLE_ALBUM':
      return state.map(([id, album]) => {
        if (id == action.albumId) {
          return [id, Object.assign({}, album, {
            isSelected: !album.isSelected
          })];
        } else {
          return [id, album];
        }
      });
    case 'SELECTED_ALBUMS':
      return action.selectedAlbums;
    default:
      return state;
  }
};


export const app = combineReducers({
  selectedAlbums, years, albums
});
