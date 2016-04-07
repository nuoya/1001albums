import React, {Component, createElement} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import superagent from 'superagent';

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
    superagent
      .get(this.props.source)
      .end((err, res) => {
        const allAlbums = res.body;
        this.setState({
          selectedAlbums: this._randomPick(allAlbums, this.state.years),
          allAlbums: allAlbums
        })
      });
  }

  _randomPick(albums, years) {
    years = years.length > 0 ? years : this.props.allYears;
    const pickedAlbums = _.toPairs(albums)
      .filter(([id, album]) => _.some(years.map(year => {
        const release_year = new Date(Date.parse(album.release_date)).getFullYear();
        const diff = release_year - year;
        return 0 <  diff && diff <  10;})))
      .sort(x => 0.5 - Math.random())
      .slice(0, this.props.count);
    return pickedAlbums.map(
      ([id, album]) => [id, Object.assign({isSelected: false}, album)]);
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
      selectedAlbums: this._randomPick(this.state.allAlbums, updatedYears),
    });
  }

  handleToggleAlbum(albumId) {
    const selectedAlbums = _(this.state.selectedAlbums).cloneDeep();
    selectedAlbums.map(([id, album]) => {
      if(id == albumId) {
        album.isSelected = ! album.isSelected;
      }
    })
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
}


class Albums extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="albums">
        <YearMenu
          years={this.props.years}
          allYears={this.props.allYears}
          onToggleYear={year => this.props.onToggleYear(year)} />
        <div className="grids">
          {this.props.albums.map(([id, album]) => createElement(
            Album, Object.assign({key: id, onToggle: () => this.props.onToggleAlbum(id)}, album)
          ))}
        </div>
      </div>
    );
  }
}


class Album extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    var image = this.props.images.filter(x => Math.abs(x.width - 300) < 100)[0];
    return (
      <section className="flip-item-wrap">
        <img className="fake-image" src={recordImg} alt="" />
        <input
          type="checkbox" className="flipper" id={this.props.id}
          onChange={this.props.onToggle}
          checked={this.props.isSelected} hidden />
        <label htmlFor={this.props.id} className="flip-item">
          <figure className="front"><img src={image.url} alt=""></img></figure>
          <figure className="back">
            <img src={image.url} alt=""></img>
            <div className="flip-item-desc">
              <h4 className="flip-item-title">{this.props.name}</h4>
              <p>{new Date(Date.parse(this.props.release_date)).getFullYear()}</p>
              <a className="artist-link" href={this.props.artists[0].uri}><p>{this.props.artists[0].name}</p></a>
              <a className="play-button" href={this.props.uri}><i className="fa fa-play-circle-o fa-4x"></i></a>
            </div>
          </figure>
        </label>
      </section>
    );
  }
}


class YearMenu extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="pure-menu pure-menu-horizontal fixed-top">
        <label style={{ float: 'right', margin: '0 60px 0 0'}}><img src={logoIcon}/></label>
        <label className="pure-menu-heading">Release Year</label>
        <ul className="pure-menu-list">
          {this.props.allYears.map(year =>
            <YearButton
              key={year}
              year={year}
              isSelected={this.props.years.indexOf(year) != -1}
              onClick={() => this.props.onToggleYear(year)}
            />)
          }
        </ul>
      </div>
    );
  }
}


class YearButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const labelStyle = {};
    if (this.props.isSelected) {
      labelStyle.backgroundColor = '#d8d8d8';
    }
    return (
      <li className="pure-menu-item" onChange={this.props.onClick} >
        <label style={labelStyle} className="pure-menu-link toggle">
          <input name="years" type="checkbox" checked={this.props.isSelected} value={this.props.year} hidden/>
          {this.props.year}s
        </label>
      </li>
    );
  }
}


ReactDOM.render(<AlbumsContainer source={dataFile} />,
                document.getElementById('container'));
