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

import ImageViewer from './ImageViewer.js';
import EditCity from './EditCity.js'

const K_WIDTH = 30;
const K_HEIGHT = 30;
const K_SIZE = 20;

const styles = theme => ({
  MarkerContainer: {
    width: K_SIZE,
    height: K_SIZE,
    position: 'absolute',
    left: -K_SIZE / 2,
    top: -K_SIZE,
  },
  MarkerStyle: {
    // initially any map object has left top corner at lat lng coordinates
    // it's on you to set object origin to 0,0 coordinates
    // position: 'absolute',
    width: K_SIZE,
    height: K_SIZE,
    left: -K_SIZE / 2,
    top: -K_SIZE / 2,
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
    data: {city: "", country: "", countryCode: "", lat: null, lng: null, index: null, urls: [[]]},
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
    }
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
    toggleEditForm = () => {
      //if the editor is about to open, hide the hover box
      this.props.changeHoverIndex(null)
      this.setState(prevState => ({
        editorIsOpen: !prevState.editorIsOpen,
        hover: false,
      }));
    }

    //function for submitting the updated form data to the server
    submitForm = () => {
      ReactDOM.findDOMNode(this.formEditCity).dispatchEvent(new Event("submit"))
      this.toggleEditForm();
    }

    //function for toggling whether the image viewer is open or not
    // setImageViewerOpen = (boolean) => {
    //   this.setState({
    //     imageViewerOpen: boolean,
    //   }, this.props.setImgViewerIsOpen(boolean));
    // }

    //function for opening the Image Viewer when one of the thumbnails is clicked on 
    imgOnClick = (e) => {
      //console.log("OPEN")
      e.preventDefault();
      //this.setImageViewerOpen(true);
      this.props.setCurrImg(e.target.getAttribute('number'))
      this.props.toggleImageViewerOpen(true)
      // this.setState({
      //   currImg: parseInt(e.target.getAttribute('number')),
      //   imageViewerOpen: true,
      // })
      //this.props.setImgViewerIsOpen(true);
    }

    //function for changing the current image in the Image Viewer
    setCurrImg = (i) => {
      this.setState({
        currImg: i,
      })
    }

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

    generateClassNames = (element) => {
      const classes = this.props.classes;
      if (element === "Marker") {
        return clsx(this.props.classes.MarkerStyle);
      } else if (element === "Box") {
        return clsx(classes.BoxStyle, classes.BoxStyleHover, {[classes.BoxStyleMouseLeave]: !this.state.hover})
      }
    }

  render() {
    //if there are images, iterate over the urls and return img tags with data
    // const images = this.props.data.images.length > 0 ? this.props.data.images.map((obj, i) => {
    //   return (<img 
    //     key={i} 
    //     number={i} 
    //     src={this.props.backendURL + obj.src} 
    //     style={{"height": 40, "width": 40}} 
    //     onClick={this.imgOnClick}
    //     />)
    // }) : null;

    return (
    
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className={clsx(this.props.classes.MarkerContainer)} onClick={() => this.props.markerClick(this.props.data)}>
        <svg
          style={styles.addIcon}
          viewBox="0 0 288 512"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className={this.generateClassNames("Marker")}
          data-tip
          data-for={this.props.data.city}
        >
          <path
            d={pin}
          />
        </svg>
        <ReactTooltip id={this.props.data.city} place="top" type="light" effect="solid">
          <span>{this.props.data.city}, {this.props.data.country}</span>
          <br />
          <span>Click To View Gallery</span>
        </ReactTooltip>
      </div>
        );
    }
}

const pin = "M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47 0 0 64.47 0 144s64.47 144 144 144 144-64.47 144-144S223.53 0 144 0zm0 76c-37.5 0-68 30.5-68 68 0 6.62-5.38 12-12 12s-12-5.38-12-12c0-50.73 41.28-92 92-92 6.62 0 12 5.38 12 12s-5.38 12-12 12z"

export default withStyles(styles)(Marker);
