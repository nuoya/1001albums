import _ from 'lodash';
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
    case 'ALBUMS_FETCH_SUCCEEDED':
      // TODO hardcoded
      return _.toPairs(action.albums).slice(0, 10);
    default:
      return state
  }
};


const album = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_ALBUM':
      if (state.id != action.id) {
        return state
      }
      return Object.assign({}, state, {
        isSelected: !state.isSelected
      });
    default:
      return state;
  }
};


export const app = combineReducers({
  selectedAlbums, years
});
