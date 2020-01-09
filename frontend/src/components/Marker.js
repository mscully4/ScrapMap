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

import ImageViewer from './ImageViewer.js';
import EditCity from './EditCity.js'

const K_WIDTH = 40;
const K_HEIGHT = 40;
const K_SIZE = 10;

const styles = theme => ({
  MarkerStyle: {
    // initially any map object has left top corner at lat lng coordinates
    // it's on you to set object origin to 0,0 coordinates
    position: 'absolute',
    width: K_SIZE,
    height: K_SIZE,
    left: -K_SIZE / 2,
    top: -K_SIZE / 2,
  
    border: '5px solid #f44336',
    borderRadius: K_SIZE,
    backgroundColor: 'white',
    textAlign: 'center',
    color: '#3f51b5',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
    cursor: 'pointer',
    "&:hover": {
      backgroundColor: "#ffffff"
    }
  }, 
  MarkerStyleHover: {
    border: '5px solid #3f51b5',
    backgroundColor: '#f44343',
  },
  BoxStyle: {
    display: 'inline-block',
    backgroundColor: "#ffffff",
    minWidth: 150,
    height: 150,
    left: 19,
    position: 'relative',
    borderRadius: 4,
    boxShadow: '0px 0px 8px -1px black',
    top: -19,
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
    setImageViewerOpen = (boolean) => {
      this.setState({
        imageViewerOpen: boolean,
      }, this.props.setImgViewerIsOpen(boolean));
    }

    //function for opening the Image Viewer when one of the thumbnails is clicked on 
    imgOnClick = (e) => {
      //console.log("OPEN")
      e.preventDefault();
      //this.setImageViewerOpen(true);
      this.setState({
        currImg: parseInt(e.target.getAttribute('number')),
        imageViewerOpen: true,
      })
      this.props.setImgViewerIsOpen(true);
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
        return clsx(this.props.classes.MarkerStyle, {[this.props.classes.MarkerStyleHover]: this.props.hoverIndex === this.props.data.index});
      } else if (element === "Box") {
        return clsx(classes.BoxStyle, classes.BoxStyleHover, {[classes.BoxStyleMouseLeave]: !this.state.hover})
      }
    }

  render() {
    //if there are images, iterate over the urls and return img tags with data
    const images = this.props.data.images.length > 0 ? this.props.data.images.map((obj, i) => {
      return (<img 
        key={i} 
        number={i} 
        src={this.props.backendURL + obj.src} 
        style={{"height": 40, "width": 40}} 
        onClick={this.imgOnClick}
        />)
    }) : null;

    return (
      <div className={this.generateClassNames("Marker")} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div className={this.generateClassNames("Box")}>
          <p className="city-text">{this.props.data.city},<br />{this.props.data.country}</p>
          <div className="tailShadow"></div>
          <div className="tail1"></div>
          <div className="tail2"></div>
          
          <FontAwesomeIcon icon={"edit"} style={{margin: 5}} onClick={this.toggleEditForm}/>
          <FontAwesomeIcon icon={"trash"} style={{ margin: 5}} onClick={(e) => this.props.handleDeleteCity(e, this.state)}/>
          
          {images}            
          
          <ImageViewer 
            isOpen={this.state.imageViewerOpen} 
            setImageViewerOpen={this.setImageViewerOpen}
            images={ this.props.data.images }
            currImg={ this.state.currImg }
            changeCurrImg={ this.changeCurrImg }
            setCurrImg={ this.setCurrImg }
            backdropClosable={true}
            handleImageOverwrite={this.props.handleImageOverwrite}
            
          />
          <EditCity
          isOpen={this.state.editorIsOpen}
          toggle={this.toggleEditForm}
          handleEditCity={this.props.handleEditCity}
          data={this.props.data}
          />
          {/* <Modal isOpen={this.state.editorIsOpen} toggle={this.toggleEditForm}>
            <ModalHeader toggle={this.toggleEditForm}>Edit</ModalHeader>
            <ModalBody>
              <Form id="" ref={ref => this.formEditCity = ref} onSubmit={e => this.props.handleEditCity(e, this.state)} >
                <Input
                  type="text"
                  name="city"
                  placeholder={this.props.place.city}
                  value={this.state.place.city}
                  onChange={this.handleChange}
                />
                <br />
                <Input
                  type="text"
                  name="country"
                  placeholder={this.props.place.country}
                  value={this.state.place.country}
                  onChange={this.handleChange}
                />
                <br />
                  <Input
                  type="text"
                  name="latitude"
                  placeholder={this.props.lat}
                  value={this.state.place.latitude}
                  onChange={this.handleChange}
                />
                <br />
                  <Input
                  type="text"
                  name="longitude"
                  placeholder={this.props.lng}
                  value={this.state.place.longitude}
                  onChange={this.handleChange}
                />
                <br />
                <Input
                  multiple
                  type="file"
                  name="file"
                  onChange={this.handleImageChange}
                />
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.submitForm}>Submit</Button>
            </ModalFooter>
          </Modal> */}
        
        </div>
      </div>
        );
    }
}

export default withStyles(styles)(Marker);
