import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import superagent from 'superagent';

require('./style.css');
require('font-awesome/css/font-awesome.css');
require('purecss/build/pure-min.css');
require('purecss/build/grids-responsive-min.css');

class Album extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isChecked: false};
  }
  handleChange() {
    this.setState({isChecked: !this.state.isChecked});
  }
  render () {
    var image = _(this.props.images)
      .filter(x => Math.abs(x.width - 300) < 100)
      .first();
    return (
      <section className="flip-item-wrap">
        <img className="fake-image" src="record.jpg" alt="" />
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

class Albums extends React.Component {

  constructor(props) {
    super(props);
    this.allYears = [1950, 1960, 1970, 1980, 1990, 2000, 2010];
    this.state = {years: this.allYears};
  }

  componentDidMount () {
    superagent
      .get(this.props.source)
      .end((err, res) => this.setState({albums: res.body}));
  }

  handleYearUpdate(years) {
    this.setState({years: years});
  }

  _randomPick(albums, years, cnt) {
    var ids = _(albums)
      .keys()
      .filter(id => _.some(years.map(year => {
        const release_year = new Date(Date.parse(albums[id].release_date)).getFullYear();
        const diff = release_year - year;
        return 0 <  diff && diff <  10;})))
      .sort(x => 0.5 - Math.random())
      .slice(0, cnt)
      .value();
    return ids;
  }

  render() {
    const ids = this._randomPick(this.state.albums, this.state.years, 100);
    return (
      <div id="albums">
        <YearMenu handleUpdate={(years) => this.handleYearUpdate(years)} allYears={this.allYears} />
        <div className="grids">
        {ids.map(id => React.createElement(
          Album, _.merge(this.state.albums[id], {key: id})
        ))}
        </div>
      </div>
    );
  }
}


class YearMenu extends React.Component {

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
        <label style={{ float: 'right', margin: '0 60px 0 0'}}><img src="logo.png"/></label>
        <label className="pure-menu-heading">Release Year</label>
        <ul className="pure-menu-list">
          {this.props.allYears.map(year => React.createElement(
            YearButton,
            {key: year, year: year, onClick: (year, checked) => this.handleClick(year, checked)}))}
        </ul>
      </div>
        );
  }
}

class YearButton extends React.Component {

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

ReactDOM.render(<Albums source="data.json" />,
                document.getElementById('container'));
