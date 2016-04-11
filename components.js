import React, { PropTypes } from 'react';

require('./static/style.css');
require('font-awesome/css/font-awesome.min.css');
require('purecss/build/base-min.css');
require('purecss/build/menus-min.css');

const recordImg = require('./static/record.jpg');
const logoIcon = require('./static/logo.png');

export const Albums = ({albums, years, allYears, onYearToggle, onAlbumToggle}) => (
  <div id="albums">
    <YearMenu
      years={years}
      allYears={allYears}
      onYearToggle={year => onYearToggle(year)} />
    <div className="grids">
      {albums.map(
        ([id, album]) =>
          <Album
            {...Object.assign(
              {key: id, onToggle: () => onAlbumToggle(id)}, album)
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
        type="checkbox" className="flipper"
        id={id} onChange={onToggle}
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


const YearMenu = ({allYears, years, onYearToggle}) => (
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
          onClick={() => onYearToggle(year)}
        />)
      }
    </ul>
  </div>
);

YearMenu.propTypes = {
  allYears: PropTypes.array.isRequired,
  years: PropTypes.array.isRequired,
  onYearToggle: PropTypes.func.isRequired
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
