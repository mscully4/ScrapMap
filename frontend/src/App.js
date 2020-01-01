import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import jwt_decode from "jwt-decode";
// import {
//     Button,
//     Nav,
//     Navbar,
//     NavbarToggler,
//     NavbarBrand,
//     NavItem,
//     Modal,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
//     ModalItem
// } from 'reactstrap'

import Map from './components/Map';
import Navigation from "./components/NavBar";
import S3 from 'react-aws-s3';

import {fetchCurrentUser, fetchToken, putNewUser, postNewCity, putEditCity, deleteCity } from "./utils/fetchUtils" 

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrash, faSync  } from '@fortawesome/free-solid-svg-icons';

import "./App.css";

library.add(faEdit);
library.add(faTrash);
library.add(faSync);

const styles = {
  space: {
    height: 200,
    width: '100%',
  },
  quote: {
    fontFamily: "Parisienne",
    fontSize: 32,
    color: '#000',  
   /* color: #429bf5 !important,*/
    textAlign: 'center',
    margin: '20px 0',
  }
}

const config = {
  bucketName: 'scrapmap',
  //dirName: 'media', /* optional */
  region: 'us-east-1',
  accessKeyId: 'AKIA2WIZHBHNCAZFMXVM',
  secretKeyAccess: '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',
  s3Url: 'http://scrapmap.s3.amazonaws.com/', /* optional */
}

//const S3Client = new S3(config)



class App extends Component {
  constructor(props) {
    super(props);
    
    let token = localStorage.getItem("token");

    this.state = {
      loggedIn: token && (jwt_decode(token).exp > (Date.now()/1000)) ? true : false,
      username: null,
      showLoginModal: false,
      modalSignUp: false,

      cities: [],

      width: window.innerWidth * .8,
      height: window.innerHeight * .8,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    if (this.state.loggedIn) {
      fetchCurrentUser(localStorage.getItem("token"))
      .then(data => {
          this.setState({ 
            username: data.user.username, 
            cities: data.destinations
          })
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
      this.setState({ width: window.innerWidth * .8, height: window.innerHeight * .8 });
  }

    // baseURL + token-auth/
  handleLogin = (e, data) => {
    e.preventDefault();
    fetchToken(data)
    .then(json => {
      // console.log(json.token)
      if (json) {
        localStorage.setItem('token', json.token);
        this.setState({
          loggedIn: true,
          username: json.user.username,
          cities: json.destinations,
        })
      }
    }) 
  }

    //baseURL + core/users/
  handleSignup = (e, data) => {
    e.preventDefault();
    putNewUser(data)
    .then(json => {
      if (json) {
        localStorage.setItem("token", json.token);
        this.setState({
          loggedIn: true,
          username: json.username
        })
      }
    })  
  };

  handleAddCity = (e, data) => {
    e.preventDefault();
    if (this.state.loggedIn) {
      postNewCity(localStorage.getItem('token'), data)
      .then(res => {
        if (res) {
          this.setState({
            cities: this.state.cities.concat([res])
          })
        }
      })
    }
  }

  handleEditCity = (e, data) => {
    e.preventDefault();
    putEditCity(localStorage.getItem('token'), data)
    .then(json => {
      this.setState({
        cities: this.state.cities.map(el => el.pk === json.pk ? json : el)
      })
    })
  }

  handleDeleteCity = (e, data) => {
    e.preventDefault();
    deleteCity(localStorage.getItem('token'), data)
    .then(json => {
      this.setState({
        //why is this json.destinations?
        cities: json.destinations
      })
    })
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({
      loggedIn: false,
      username: '',
      showModalLogin: false,
      modalSignUp: false,
      cities: null,
    })
  };

  handleImageOverwrite = (img, dataURL) => {
    var AWS = require('aws-sdk/dist/aws-sdk-react-native');
    const credentials = { accessKeyId: config.accessKeyId, secretAccessKey: config.secretKeyAccess, region: config.region }
    AWS.config.update(credentials)
    var s3Bucket = new AWS.S3( { params: {Bucket: 'scrapmap'} } );

    const buf = new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const type = dataURL.split(';')[0].split('/')[1];
    
    var data = {
      Key: `BOOF/NY1.${type}`, 
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };
    console.log(data)
    s3Bucket.putObject(data, function(err, data){
        if (err) { 
          console.log(err);
          console.log('Error uploading data: ', data); 
        } else {
          console.log('succesfully uploaded the image!');
        }
    });
  }


  render = () => {
    //this.updateWindowDimensions();
    return (
      <React.Fragment>
        <Navigation 
          loggedIn={this.state.loggedIn} 
          username={this.state.username} 
          handleLogout={this.handleLogout} 
          handleAddCity={this.handleAddCity} 
          toggleLoggedIn={this.toggleLogIn}
          toggleSignUp={this.toggleSignUp}
          handleLogin={this.handleLogin}
          handleSignup={this.handleSignup}
          username={this.state.username}
        />
        <h1 style={styles.quote}>"To Travel is to BOOF"</h1>
        <Map 
          width={ this.state.width } 
          height={ this.state.height } 
          cities={ this.state.cities }
          logged_in={ this.state.loggedIn }
          handleEditCity={this.handleEditCity}
          handleDeleteCity={this.handleDeleteCity}
          handleImageOverwrite={this.handleImageOverwrite}
        />
        <div style={styles.space}></div>
      </React.Fragment>
    );
  }
}

export default Dimensions()(App);
