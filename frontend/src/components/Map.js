import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import controllable from 'react-controllables';

import Marker from './Marker.js';
import {K_SIZE} from './MarkerStyle.js';

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
  
  // _onBoundsChange = (center, zoom) => {
  //   this.props.onCenterChange(center);
  //   this.props.onZoomChange(zoom);
  // }

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
    //TODO change marker size based on zoom
    this.props.changeGranularity(zoom)
    this.props.onCenterChange(center)
    this.props.onZoomChange(zoom)
  }

  handleApiLoaded(map, maps) {
    //console.log(map, maps);
  }

  // setImgViewerIsOpen = (boolean) => {
  //   this.setState({
  //     imgViewerIsOpen: boolean,
  //   })
  // }

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

  render() {
    let places = this.props.cities ? this.props.cities.map(data => {
      return (<Marker
        key={data.pk}
        lat={data.latitude}
        lng={data.longitude}
        data={data}
        changeHoverIndex={this.props.changeHoverIndex}
        hoverIndex={this.props.hoverIndex}
        // toggleImageViewerOpen={this.props.toggleImageViewerOpen}
        //setCurrImg={this.props.setCurrImg}
        markerClick={this.props.markerClick}
        zoom={this.props.zoom}
      />)
    }) : null;
      
    return (
      <div style={styles.map}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: this.state.apiKey }}
          center={this.props.center}
          zoom={this.props.zoom}
          hoverDistance={K_SIZE / 2}
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
          {places}
        </GoogleMapReact>
      </div>
    )
  }
}
)

export default Map;
