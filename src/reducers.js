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

const selectedAlbums = (state = new Map(), action) => {
  switch (action.type) {
    case 'TOGGLE_ALBUM':
      const newState = new Map(state);
      const album = state.get(action.albumId);
      newState.set(action.albumId, Object.assign({}, album, {
          isSelected: !album.isSelected
        })
      );
      return newState;
    case 'SELECTED_ALBUMS':
      return action.selectedAlbums;
    default:
      return state;
  }
};


export const app = combineReducers({
  selectedAlbums, years, albums
});
