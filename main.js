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
    this.allYears = [1950, 1960, 1970, 1980, 1990, 2000, 2010];
    this.count = 100;
    this.state = {years: this.allYears, albums: {}}
  }

  componentDidMount () {
    superagent
      .get(this.props.source)
      .end((err, res) => this.setState({albums: res.body}));
  }

  _randomPick(albums, years, cnt) {
    const pickedAlbums = _.toPairs(albums)
      .filter(([id, album]) => _.some(years.map(year => {
        const release_year = new Date(Date.parse(albums[id].release_date)).getFullYear();
        const diff = release_year - year;
        return 0 <  diff && diff <  10;})))
      .sort(x => 0.5 - Math.random())
      .slice(0, cnt);
    return pickedAlbums;
  }

  handleYearUpdate(years) {
    this.setState({years: years});
  }

  render() {
    return (
      <Albums albums={this._randomPick(this.state.albums, this.state.years, this.count)}
              allYears={this.allYears}
              onYearUpdate={years => this.handleYearUpdate(years)}/>
    )
  }
}


class Albums extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="albums">
        <YearMenu handleUpdate={years => this.props.onYearUpdate(years)} allYears={this.props.allYears} />
        <div className="grids">
          {this.props.albums.map(([id, album]) => createElement(
            Album, Object.assign({key: id}, album)
          ))}
        </div>
      </div>
    );
  }
}


class Album extends Component {

  constructor(props) {
    super(props);
    this.state = {isChecked: false};
  }

  handleChange() {
    this.setState({isChecked: !this.state.isChecked});
  }

  render () {
    var image = this.props.images.filter(x => Math.abs(x.width - 300) < 100)[0];
    return (
      <section className="flip-item-wrap">
        <img className="fake-image" src={recordImg} alt="" />
        <input type="checkbox" className="flipper" id={this.props.id}
               onChange={() => this.handleChange()}
               checked={this.state.isChecked} hidden />
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
    this.state = {years: []};
  }

  handleClick(year, checked) {
    let years = _(this.state.years).cloneDeep();
    if (checked) {
      years.push(year);
    } else {
      years = years.filter(x => x != year);
    }
    this.props.handleUpdate(years.length > 0 ? years : this.props.allYears);
    this.setState({years: years});
  }

  render() {
    return (
      <div className="pure-menu pure-menu-horizontal fixed-top">
        <label style={{ float: 'right', margin: '0 60px 0 0'}}><img src={logoIcon}/></label>
        <label className="pure-menu-heading">Release Year</label>
        <ul className="pure-menu-list">
          {this.props.allYears.map(year => createElement(
            YearButton,
            {key: year, year: year, onClick: (year, checked) => this.handleClick(year, checked)}))}
        </ul>
      </div>
        );
  }
}


class YearButton extends Component {

  constructor(props) {
    super(props);
    this.state = {selected: false};
  }

  handleChange() {
    const selected = !this.state.selected;
    this.setState({selected: selected});
    this.props.onClick(this.props.year, selected);
  }

  render() {
    let labelStyle;
    if (this.state.selected) {
      labelStyle = { backgroundColor: '#d8d8d8' };
    } else {
      labelStyle = {};
    }
    return (
      <li className="pure-menu-item" onChange={() => this.handleChange()} >
        <label style={labelStyle} className="pure-menu-link toggle">
          <input name="years" type="checkbox" checked={this.state.selected} value={this.props.year} hidden/>
          {this.props.year}s
        </label>
      </li>
    );
  }
}


ReactDOM.render(<AlbumsContainer source={dataFile} />,
                document.getElementById('container'));
