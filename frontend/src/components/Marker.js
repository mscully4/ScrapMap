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
import ReactTooltip from 'react-tooltip';
import { pin } from '../utils/SVGs'

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
    fill: "red",
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
    backgroundColor: '#fff',
    padding: '12px 21px',
    opacity: .9,
    fontSize: 13,
    whiteSpace: "nowrap",
    visibility: "hidden",
    "&:after": {
      position: "absolute",
      content: '""',
      width: 0,
      height: 0,

      borderTopColor: "#fff",
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
    //this.props.setMarkerRefs(this.props.data.city, this.tooltipRef)
    this.setState({
      tooltipWidth: this.ref.current.offsetWidth,
      tooltipHeight: this.ref.current.offsetHeight
    }, () => console.log(this.state.tooltipWidth, this.state.tooltipHeight))
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

  //function for toggling whether the editor is open or not
  // toggleEditForm = () => {
  //   //if the editor is about to open, hide the hover box
  //   this.props.changeHoverIndex(null)
  //   this.setState(prevState => ({
  //     editorIsOpen: !prevState.editorIsOpen,
  //     hover: false,
  //   }));
  // }

    //function for submitting the updated form data to the server
  // submitForm = () => {
  //   ReactDOM.findDOMNode(this.formEditCity).dispatchEvent(new Event("submit"))
  //   this.toggleEditForm();
  // }

  //function for toggling whether the image viewer is open or not
  // setImageViewerOpen = (boolean) => {
  //   this.setState({
  //     imageViewerOpen: boolean,
  //   }, this.props.setImgViewerIsOpen(boolean));
  // }

  //function for opening the Image Viewer when one of the thumbnails is clicked on 
  // imgOnClick = (e) => {
  //   //console.log("OPEN")
  //   e.preventDefault();
  //   //this.setImageViewerOpen(true);
  //   this.props.setCurrImg(e.target.getAttribute('number'))
  //   this.props.toggleImageViewerOpen(true)
  //   // this.setState({
  //   //   currImg: parseInt(e.target.getAttribute('number')),
  //   //   imageViewerOpen: true,
  //   // })
  //   //this.props.setImgViewerIsOpen(true);
  // }

  //function for changing the current image in the Image Viewer
  // setCurrImg = (i) => {
  //   this.setState({
  //     currImg: i,
  //   })
  // }

  onMouseEnter = (e) => {
    this.setState({
      hover: true,
    })
    this.props.changeHoverIndex(this.props.data.index)
  }

  onMouseLeave = (e) => {
    this.setState({
      hover: false,
    })
    this.props.changeHoverIndex(null)
  }

  render() {
    const scale = ((this.props.zoom - 4)/10);
    if (this.props.hoverIndex === this.props.data.index) {
      // console.log(this.tooltipRef)
      console.log(this.tooltipRef)
       ReactTooltip.show(this.tooltipRef)
    }
    //console.log(this.state.tooltipHeight)
    return (
    
      <div 
      onMouseEnter={this.onMouseEnter} 
      onMouseLeave={this.onMouseLeave} 
      className={clsx(this.props.classes.MarkerContainer)} 
      onClick={() => this.props.markerClick(this.props.data)}
      style={{
        top: -HEIGHT - (HEIGHT * scale),
        left: (-WIDTH/2) - ((HEIGHT * scale)/2)
      }}
      >
        <svg
          ref={ref => this.tooltipRef = ref}
          style={styles.addIcon}
          viewBox="0 0 288 512"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className={clsx(this.props.classes.MarkerStyle, {[this.props.classes.MarkerStyleHover]: this.props.hoverIndex === this.props.data.index})}
          data-tip
          data-for={this.props.data.city}
          style={{
            width: WIDTH + (WIDTH * scale),
            height: HEIGHT + (HEIGHT * scale),
          }}
        >
          <path
            d={pin}
          />
        </svg>

        <div 
        style={{ left: (-this.state.tooltipWidth / 2) + 10, top: (-this.state.tooltipHeight / 2) - 35 }} 
        ref={this.ref} 
        className={clsx(this.props.classes.Tooltip, {[this.props.classes.TooltipShow]: this.props.hoverIndex === this.props.data.index} )}>
          <span>{this.props.data.city}, {this.props.data.country}</span>
          <br />
          <span>Click To View Gallery</span>
        </div>
       
      </div>
    );
  }
}

export default withStyles(styles)(Marker);
