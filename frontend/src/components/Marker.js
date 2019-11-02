import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
    Button,
    Form,
    Input,
    InputGroup,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import { MarkerStyle, MarkerStyleHover, BoxStyle, BoxStyleHover } from './MarkerStyle.js';
import { putEditCity } from "../utils/fetchUtils" 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageViewer from './ImageViewer.js';

//import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Marker extends Component {
    static propTypes = {
        text: PropTypes.string,
        $hover: PropTypes.bool,
    };

    static defaultProps = {
    };

    //shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props) {
      super(props);
      this.state = {
        //the data for the destination
        city: this.props.city,
        country: this.props.country,
        latitude: this.props.lat,
        longitude: this.props.lng,
        pk: this.props.pk,
        //whether the marker is hovered over
        hover: false,
        //Whether the editor modal is open
        editorIsOpen: false,
        //the image files that will be uploaded to the server
        files: [],
        //Image Viewer Vars
        imageViewerOpen: false,
        currImg: 0,
      }

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

    //function for handling addition of images to the editor
    handleImageChange = e => {
      const name = e.target.name;
      const value = e.target.value;
        console.log(name, value);
        this.setState({
            files: e.target.files,
        })
    }

    //function for toggling whether the editor is open or not
    toggleEditForm = () => {
      this.setState(prevState => ({
        editorIsOpen: !prevState.editorIsOpen,
      }));
    }

    //function for submitting the updated form data to the server
    submitForm = () => {
      ReactDOM.findDOMNode(this.formEditCity).dispatchEvent(new Event("submit"))
      this.toggleEditForm();
    }

    //function for toggling whether the image viewer is open or not
    toggleImageViewer = () => {
      this.setState(prevState=> ({
        imageViewerOpen: !prevState.imageViewerOpen,
      }));
    }

    //function for opening the Image Viewer when one of the thumbnails is clicked on 
    imgOnClick = (e) => {
      e.preventDefault();
      this.toggleImageViewer();
      this.setState({
        currImg: parseInt(e.target.getAttribute('number')),
        imageViewerOpen: true,
      })
    }

    //function for changing the current image in the Image Viewer
    setCurrImg = (i) => {
      this.setState({
        currImg: i,
      })
    }

    // handleEditCity = (e) => {
    //   console.log(this.state)
    //   e.preventDefault();
    //   // const entry = {
    //   //   "pk": data.pk,
    //   //   "city": data.city,
    //   //   "country": data.country,
    //   //   "latitude": data.latitude,
    //   //   "longitude": data.longitude,
    //   //   "images": data.files,
    //   // }
     
    //   // const form = new FormData();
    //   // form.append('pk', this.state.pk);
    //   // form.append('city', this.state.city);
    //   // form.append('country', this.state.country);

    //   // for (var i=0; i<data.files.length; i++) {
    //   //   form.append('images', data.files[i]);
    //   // }
    //   // form.append('images', data.files);

    //   putEditCity(localStorage.getItem('token'), this.state)
    //   .then(json => {console.log(json); this.setState({
    //     city: json.city,
    //     country: json.country,
    //     latitude: json.latitude,
    //     longitude: json.longitude
    //   })})
    // }

    onMouseEnter = (e) => {
      this.setState({
        hover: true,
      })
    }

    onMouseLeave = (e) => {
      this.setState({
        hover: false,
      })
    }

    render() {
      // console.log("RENDER")
        const style = this.props.$hover ? MarkerStyleHover : MarkerStyle;
        
        //if there are images, iterate over the urls and return img tags with data
        const images = this.props.urls ? this.props.urls.map((url, i) => {
          return (<img 
              key={i} 
              number={i} 
              src={"http://localhost:8000" + url} 
              style={{"height": 40, "width": 40}} 
              onClick={this.imgOnClick}
              />)
        }) : null;

        return (
          <div style={style} className="marker" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <div className="box" style={{
               display: 'inline-block',
               backgroundColor: "#ffffff",
               minWidth: 150,
               height: 150,
               left: 19,
               position: 'relative',
               borderRadius: 4,
               boxShadow: '0px 0px 8px -1px black',
               top: -19,
               visibility: this.state.hover ? "visible" : "hidden",
            }}>
              <p className="city-text">{this.props.city},<br />{this.props.country}</p>
              <div className="tailShadow"></div>
              <div className="tail1"></div>
              <div className="tail2"></div>
              
              <FontAwesomeIcon icon={"edit"} onClick={this.toggleEditForm}/>
              
              {images}            
              
              {/* <ImageViewer 
                isOpen={this.state.imageViewerOpen} 
                toggleImageViewer={this.toggleImageViewer}
                urls={ this.props.urls }
                currImg={ this.state.currImg }
                changeCurrImg={ this.changeCurrImg }
                setCurrImg={ this.setCurrImg } 
              /> */}
              
              <Modal isOpen={this.state.editorIsOpen} toggle={this.toggleEditForm}>
                <ModalHeader toggle={this.toggleEditForm}>Edit</ModalHeader>
                <ModalBody>
                  <Form id="" ref={ref => this.formEditCity = ref} onSubmit={e => this.props.handleEditCity(e, this.state)} >
                    <Input
                      type="text"
                      name="city"
                      placeholder={this.props.city}
                      value={this.state.city}
                      onChange={this.handleChange}
                    />
                    <br />
                    <Input
                      type="text"
                      name="country"
                      placeholder={this.props.country}
                      value={this.state.country}
                      onChange={this.handleChange}
                    />
                    <br />
                     <Input
                      type="text"
                      name="latitude"
                      placeholder={this.props.lat}
                      value={this.state.latitude}
                      onChange={this.handleChange}
                    />
                    <br />
                     <Input
                      type="text"
                      name="longitude"
                      placeholder={this.props.lng}
                      value={this.state.longitude}
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
              </Modal>
            
            </div>
          </div>
        );
    }
}
