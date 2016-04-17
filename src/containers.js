import { connect } from 'react-redux';
import { Albums } from './components';
import {toggleAlbum, toggleYear} from './actions';
import {allYears} from './constants';

const mapStateToProps = (state) => {
  return {
    albums: state.selectedAlbums,
    years: state.years,
    allYears
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAlbumToggle: (id) => {
      dispatch(toggleAlbum(id));
    },
    onYearToggle: (year) => {
      dispatch(toggleYear(year));
    }
  };
};


export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Albums)
