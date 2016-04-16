import React, {Component, createElement, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

require('./static/style.css');
require('font-awesome/css/font-awesome.min.css');
require('purecss/build/base-min.css');
require('purecss/build/menus-min.css');

const recordImg = require('./static/record.jpg');
const logoIcon = require('./static/logo.png');
const dataFile = require('./static/data.json');


class AlbumsContainer extends Component {

  constructor() {
    super();
    this.state = {years: [], allAlbums:{}, selectedAlbums: []}
  }

  componentDidMount () {
    fetch(this.props.source)
      .then(response => response.json())
      .then(allAlbums => this.setState({
        selectedAlbums: this.randomSelect(allAlbums, this.state.years),
        allAlbums: allAlbums})
      );
  }


  randomSelect(albums, years) {
    years = years.length > 0 ? years : this.props.allYears;
    const selectedAlbums = new Map(
      _.toPairs(albums)
      .filter(([id, album]) => _.some(years.map(year => {
        const releaseYear = new Date(Date.parse(album['release_date'])).getFullYear();
        const diff = releaseYear - year;
        return 0 <  diff && diff <  10;})))
      .sort(x => 0.5 - Math.random())
      .slice(0, this.props.count));
    return selectedAlbums;
  }

  handleToggleYear(year) {
    const updatedYears = this.state.years.slice();
    const index = updatedYears.indexOf(year);
    if (index == -1) {
      updatedYears.push(year);
    } else {
      updatedYears.splice(index, 1);
    }
    this.setState({
      years: updatedYears,
      selectedAlbums: this.randomSelect(this.state.allAlbums, updatedYears)
    });
  }

  handleToggleAlbum(albumId) {
    const selectedAlbums = new Map(this.state.selectedAlbums);
    const album = selectedAlbums.get(albumId);
    selectedAlbums.set(albumId, Object.assign({}, album, {isSelected: !album.isSelected}));
    this.setState({selectedAlbums: selectedAlbums});
  }

  render() {
    return (
      <Albums
        albums={this.state.selectedAlbums}
        allYears={this.props.allYears}
        years={this.state.years}
        onToggleYear={year => this.handleToggleYear(year)}
        onToggleAlbum={albumId => this.handleToggleAlbum(albumId)}
      />
    )
  }
}

AlbumsContainer.defaultProps = {
  allYears: [1950, 1960, 1970, 1980, 1990, 2000, 2010],
  count: 100
};


const Albums = ({albums, years, allYears, onToggleYear, onToggleAlbum}) => (
  <div id="albums">
    <YearMenu
      years={years}
      allYears={allYears}
      onToggleYear={year => onToggleYear(year)} />
    <div className="grids">
      {[...albums].map(
        ([id, album]) =>
          <Album
            {...Object.assign(
              {key: id, onToggle: () => onToggleAlbum(id)}, album)
            }
          />
      )}
    </div>
  </div>
);


const Album = ({id, name, release_date, uri, artists, images, onToggle, isSelected=false}) => {
  var image = images.filter(x => Math.abs(x.width - 300) < 100)[0];
  return (
    <section className="flip-item-wrap">
      <img className="fake-image" src={recordImg} alt="" />
      <input
        type="checkbox" className="flipper" id={id}
        onChange={onToggle}
        checked={isSelected} hidden />
      <label htmlFor={id} className="flip-item">
        <figure className="front"><img src={image.url} alt=""></img></figure>
        <figure className="back">
          <img src={image.url} alt=""></img>
          <div className="flip-item-desc">
            <h4 className="flip-item-title">{name}</h4>
            <p>{new Date(Date.parse(release_date)).getFullYear()}</p>
            <a className="artist-link" href={artists[0].uri}>
              <p>{artists[0].name}</p>
            </a>
            <a className="play-button" href={uri}>
              <i className="fa fa-play-circle-o fa-4x"></i><
            /a>
          </div>
        </figure>
      </label>
    </section>
  );
};


const YearMenu = ({allYears, years, onToggleYear}) => (
  <div className="pure-menu pure-menu-horizontal fixed-top">
    <label style={{ float: 'right', margin: '0 60px 0 0'}}>
      <img src={logoIcon}/>
    </label>
    <label className="pure-menu-heading">Release Year</label>
    <ul className="pure-menu-list">
      {allYears.map(year =>
        <YearButton
          key={year}
          year={year}
          isSelected={years.indexOf(year) != -1}
          onClick={() => onToggleYear(year)}
        />)
      }
    </ul>
  </div>
);

YearMenu.propTypes = {
  allYears: PropTypes.array.isRequired,
  years: PropTypes.array.isRequired,
  onToggleYear: PropTypes.func.isRequired
};


const YearButton = ({year, isSelected, onClick}) => {
  const labelStyle = {};
  if (isSelected) {
    labelStyle.backgroundColor = '#d8d8d8';
  }
  return (
    <li className="pure-menu-item" onChange={onClick} >
      <label style={labelStyle} className="pure-menu-link toggle">
        <input
          name="years" type="checkbox"
          checked={isSelected} value={year} hidden/>
        {year}s
      </label>
    </li>
  );
}

YearButton.propTypes = {
  year: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};


ReactDOM.render(<AlbumsContainer source={dataFile} />,
                document.getElementById('container'));
