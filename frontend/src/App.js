import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import jwt_decode from "jwt-decode";
import {
    Button,
    Nav,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    NavItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalItem
} from 'reactstrap'

import Map from './components/Map';
import SubmitForm from './components/SubmitForm';
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import AddCity from "./components/AddCity";
import Navigation from "./components/NavBar";
import {ImgEditor} from './components/ImageEditor';

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
    //overwrite the image file in S3
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
