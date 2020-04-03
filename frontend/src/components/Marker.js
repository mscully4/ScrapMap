import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import {
//     Button,
//     Form,
//     Input,
//     InputGroup,
//     Modal,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
// } from 'reactstrap';
// import { putEditCity } from "../utils/fetchUtils" 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withStyles} from '@material-ui/styles';
import clsx from 'clsx';
import { pin, Svg } from '../utils/SVGs'

import ImageViewer from './ImageViewer.js';
import EditCity from './EditCity.js'
import { faHandMiddleFinger } from '@fortawesome/free-solid-svg-icons';

const WIDTH = 20;
const HEIGHT = 20;

const styles = theme => ({
  MarkerContainer: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
    // left: -WIDTH / 2,
    // top: -HEIGHT,
  },
  MarkerStyle: {
    // initially any map object has left top corner at lat lng coordinates
    // it's on you to set object origin to 0,0 coordinates
    // position: 'absolute',
    // width: K_SIZE,
    // height: K_SIZE,
    cursor: 'pointer',
    fill: "#0095d2",
    //backgroundColor: "blue",
  
    // border: '5px solid #f44336',
    // borderRadius: K_SIZE,
    // backgroundColor: 'white',
    // textAlign: 'center',
    // color: '#3f51b5',
    // fontSize: 16,
    // fontWeight: 'bold',
    // padding: 4,
    // cursor: 'pointer',
     "&:hover": {
       fill: "black"
     }
  }, 
  MarkerStyleHover: {
    fill: "black"
  },
  BoxStyle: {
    display: 'inline-block',
    backgroundColor: "#ffffff",
    minWidth: 150,
    height: 150,
    left: 30,
    position: 'absolute',
    zIndex: 9999,
    // borderRadius: 4,
    // boxShadow: '0px 0px 8px -1px black',
    boxShadow: "2px 2px 12px rgba(0, 0, 0, .75)",
    border: "solid 1px rgba(0, 0, 0, .1)",
    top: -14,
  },
  BoxStyleMouseEnter: {
    visibility: "visible",
  },
  BoxStyleMouseLeave: {
    visibility: "hidden"
  },
  Tooltip: {
    position: 'absolute',
    backgroundColor: '#0095d2',
    padding: '12px 21px',
    opacity: .9,
    fontSize: 13,
    whiteSpace: "nowrap",
    visibility: "hidden",
    boxShadow: "0 0 10px black",
    borderRadius: 5,
    zIndex: 99999,
    "&:after": {
      position: "absolute",
      content: '""',
      width: 0,
      height: 0,

      borderTopColor: "#0095d2",

      borderTopStyle: "Solid",
      borderTopWidth: "6px",

      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      bottom: -6,
      left: "50%",
      marginLeft: -8,
    },
  },
  TooltipShow: {
    visibility: "visible"
  }
})

//TODO clean up this mess
//the props.hover is if a hover event ocurs in the table, the state.hover is if a hover event occcurs on the map

class Marker extends Component {
  static propTypes = {
      text: PropTypes.string,
      $hover: PropTypes.bool,
  };

  static defaultProps = {
    //data: {city: "", country: "", countryCode: "", lat: null, lng: null, index: null, urls: [[]]},
  };

    //shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
    this.state = {
      //the data for the destination
      //place: {city: "", country: "", countryCode: "", lat: null, lng: null, index: null, urls: []},
      ...this.props.data,
      //whether the marker is hovered over
      //Whether the editor modal is open
      editorIsOpen: false,
      //the image files that will be uploaded to the server
      files: [],
      //Image Viewer Vars
      imageViewerOpen: false,
      currImg: 0,
      tooltipWidth: null,
      tooltipHeight: null,
    }

    this.ref = React.createRef()
  }

  componentDidMount = () => {
    this.setState({
      tooltipWidth: this.ref.current.offsetWidth,
      tooltipHeight: this.ref.current.offsetHeight
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  //function for handling changes to the text fields in the editor
  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

  onMouseEnter = (e) => {
    this.setState({
      hover: true,
    })
    console.log("BOOF")
    this.props.changeHoverIndex(this.props.data.index)
  }

  onMouseLeave = (e) => {
    this.setState({
      hover: false,
    })
    this.props.changeHoverIndex(null)
  }

  render() {
    const scale = ((this.props.zoom - 4) / 10);

    return (
    
      <div 
      onMouseEnter={this.onMouseEnter} 
      onMouseLeave={this.onMouseLeave} 
      className={clsx(this.props.classes.MarkerContainer)} 
      onClick={() => this.props.markerClick(this.props.data)}
      style={{
        top: -HEIGHT - (HEIGHT * scale),
        left: (-WIDTH/2) - ((WIDTH * scale)/2)
      }}
      >
        <Svg
          style={styles.addIcon}
          viewBox={pin.viewBox}
          className={clsx(this.props.classes.MarkerStyle, {[this.props.classes.MarkerStyleHover]: this.props.hoverIndex === this.props.data.index})}
          data-tip
          data-for={this.props.granularity ? this.props.data.city : null}
          style={{
            width: WIDTH + (WIDTH * scale),
            height: HEIGHT + (HEIGHT * scale),
          }}
        >
          <path
            d={pin.path}
          />
          {/* Two have a multi-colored pin, we need to lay one on top of the other */}
          <path style={{ fill: "Black" }}
            d={'M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47'}
          />
        </Svg>

        <div 
        style={{ left: (-this.state.tooltipWidth / 2) + 10 + (scale * 10), top: (-this.state.tooltipHeight / 2) - 35 - (scale * 5)}} 
        ref={this.ref} 
        className={clsx(this.props.classes.Tooltip, {[this.props.classes.TooltipShow]: this.props.hoverIndex === this.props.data.index} )}
        >
          {this.props.granularity ? <span>{this.props.data.city}, {this.props.data.country}</span> : <span>{this.props.data.name}</span>}
          <br />
          <span>Click To View Gallery</span>
        </div>
       
      </div>
    );
  }
}

export default withStyles(styles)(Marker);
