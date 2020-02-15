import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import controllable from 'react-controllables';

import Marker from './Marker.js';

import { getDistanceBetweenTwoPoints } from '../utils/Formulas.js';

const styles = {
  map: {
    width: '100%',
    height: '100vh',
    margin: 'auto'
  }
}

const Map = controllable(['center', 'zoom', 'hoverKey', 'clickKey'])(
class Map extends Component {
  
  // static propTypes = {
  //   center: PropTypes.array,
  //   zoom: PropTypes.number,
  //   //hoverKey: PropTypes.string,
  //   clickKey: PropTypes.string,
  //   onCenterChange: PropTypes.func,
  //   onZoomChange: PropTypes.func,
  //   onHoverKeyChange: PropTypes.func,

  //   greatPlaces: PropTypes.any,
  //   cities: PropTypes.any,
  // }

  // static defaultProps = {
  //   center: {lat: 40.7, lng: -74},
  //   zoom: 4,
  // }

  constructor(props) {
    super(props);

    this.state = {
      apiKey: "AIzaSyBpXqyXMWAbXFs6XCxkMUFX09ZuHzjpKHU",
    }

    this.mapRef = React.createRef();
  }

  componentDidMount = () => {
    // fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=Katz&types=tourist_attraction|point_of_interest&key=${this.state.apiKey}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then(res => console.log(res.json()))

  }

  _onChildClick = (key, childProps) => {
    this.props.onCenterChange([childProps.lat, childProps.lng]);
  }

  _onChildMouseEnter = (key) => {
    this.props.onHoverKeyChange(key);
  }

  _onChildMouseLeave = () => {
    this.props.onHoverKeyChange(null);
  }

  _onChange = ({center, zoom}) => {
    //console.log(Math.random(), center)
    //TODO change marker size based on zoom
    // if (this.props.cities.length !== 0) {
    //   console.log(getDistanceBetweenTwoPoints(center.lat, center.lng, this.props.cities[0].latitude, this.props.cities[0].longitude));
    // }
    this.props.changeGranularity(zoom)
    this.props.onCenterChange(center)
    this.props.onZoomChange(zoom)
    this.props.getClosestCity(center.lat, center.lng)
  }

  handleApiLoaded(map, maps) {
    //console.log(map, maps);
  }

  

  createMapOptions = (maps) => {
    return {
      //this controls where and how the zoom control is rendered
      zoomControlOptions: {
        position: maps.ControlPosition.RIGHT_CENTER,
        style: maps.ZoomControlStyle.SMALL
      },
      //this allows the user to change the type of map that is shown
      mapTypeControl: false,
      //this controls where and how different map options are rendered
      mapTypeControlOptions: {
        position: maps.ControlPosition.TOP_RIGHT
      },
      gestureHandling: "cooperative",
      keyboardShortcuts: false,
    };
  }

  createMarkers = (granularity) => {
    if (granularity && this.props.cities) {
      return this.props.cities.map(data => 
        <Marker
          key={data.pk}
          lat={data.latitude}
          lng={data.longitude}
          data={data}
          changeHoverIndex={this.props.changeHoverIndexCity}
          hoverIndex={this.props.hoverIndexCity}
          markerClick={this.props.markerClick}
          zoom={this.props.zoom}
          granularity={this.props.granularity}
      />
      )
    } else if (!granularity && this.props.places) {
      return this.props.places.map(data => 
        <Marker
        key={data.pk}
        lat={data.latitude}
        lng={data.longitude}
        data={data}
        changeHoverIndex={this.props.changeHoverIndexPlace}
        hoverIndex={this.props.hoverIndexPlace}
        markerClick={this.props.markerClick}
        zoom={this.props.zoom}
        granularity={this.props.granularity}
        />
      )  
    }
  }

  render() {
    return (
      <div style={styles.map}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: this.state.apiKey }}
          center={this.props.center}
          zoom={this.props.zoom}
          //hoverDistance={K_SIZE / 2}
          onChange={this._onChange}
          onChildClick={this._onChildClick}
          onChildMouseEnter={this._onChildMouseEnter}
          onChildMouseLeave={this._onChildMouseLeave}
          keyboardShortcuts={false}
          options={this.createMapOptions}
          onChange={this._onChange}
          
          yesIWantToUseGoogleMapApiInternals
          //onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
        >
          { this.createMarkers(this.props.granularity) }
        </GoogleMapReact>
      </div>
    )
  }
})

export default Map;
