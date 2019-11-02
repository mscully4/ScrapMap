import React, { Component } from 'react';
import axios from 'axios';
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

import {fetchCurrentUser, fetchToken, putNewUser, postNewCity, putEditCity } from "./utils/fetchUtils" 

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import "./App.css";

library.add(faEdit);


class App extends Component {
  constructor(props) {
    super(props);
    
    let token = localStorage.getItem("token");

    this.state = {
        loggedIn: token && (jwt_decode(token).exp > (Date.now()/1000)) ? true : false,
        username: null,
        modalLogin: false,
        modalSignUp: false,

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
        const entry = { 
          "city": data.city, 
          "country": data.country, 
          "latitude": data.latitude, 
          "longitude": data.longitude, 
        };
        postNewCity(localStorage.getItem('token'), entry)
        .then(res => {
          console.log(res)
        })
      }
    }

    handleEditCity = (e, data) => {
      e.preventDefault();
      // const entry = {
      //   "pk": data.pk,
      //   "city": data.city,
      //   "country": data.country,
      //   "latitude": data.latitude,
      //   "longitude": data.longitude,
      //   "images": data.files,
      // }
     
      console.log(data)
      const form = new FormData();
      form.append('pk', data.pk);
      form.append('city', data.city);
      form.append('country', data.country);
      form.append("latitude", data.latitude)
      form.append("longitude", data.longitude)

      // for (var i=0; i<data.files.length; i++) {
      //   form.append('images', data.files[i]);
      // }
       form.append('images', data.files);

      putEditCity(localStorage.getItem('token'), data)
      .then(json => {
        console.log(json)
        this.setState({
          cities: this.state.cities.map(el => el.pk === json.pk ? json : el)
        })
      })
    }
    
    handleGetCity = (pk) => {
        fetch("http://127.0.0.1:8000/core/destinations/" + pk + "/", {
          method: "GET",
          headers: {
            Authorization: `JWT ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
        })
        .then(function(res) {
          console.log(res);
        })

    }

    handleLogout = () => {
        localStorage.removeItem("token");
        this.setState({
            loggedIn: false,
            username: '',
            modalLogin: false,
            modalSignUp: false,
            cities: null,
        })
    };

    toggleLogin = () => {
        this.setState(prevState => ({
            modalLogin: !prevState.modalLogin,
        }));
    }

    toggleSignUp = () => {
        this.setState(prevState => ({
            modalSignUp: !prevState.modalSignUp,
        }));
    }

    render = () => {
      //this.updateWindowDimensions();
      let form, username, submitForm, addCity;
      
      if (this.state.loggedIn) {
        form = 
        <Nav className="ml-auto" navbar>
          <NavItem>
            <h3 className="nav-user"> Hello, {this.state.username} </h3>
          </NavItem>
          <NavItem>
            <h3 className="nav-divider"> | </h3>
          </NavItem>
          <NavItem>
            <Button className="nav-button" onClick={this.handleLogout}>Logout</Button>
          </NavItem>
          <NavItem>
            <AddCity handleAddCity={ this.handleAddCity }/>
          </NavItem>
        </Nav>
        
      
      } else { 
      
      form = 
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Button className="nav-button" onClick={this.toggleLogin}>Login</Button>
            <Modal isOpen={this.state.modalLogin} toggle={this.toggleLogin}>
              <ModalHeader toggle={this.toggleLogin}>Login</ModalHeader>
                <ModalBody>
                  <LoginForm handle_login={ this.handleLogin }/>
                </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </Modal>
          </NavItem>
          <br />
          <NavItem>
            <Button className="nav-button" onClick={this.toggleSignUp}>Sign Up</Button>
            <Modal isOpen={this.state.modalSignUp} toggle={this.toggleSignUp}>
              <ModalHeader toggle={this.toggleSignUp}>Sign Up</ModalHeader>
                <ModalBody>
                  <SignUpForm handle_signup={ this.handleSignup }/>
                </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </Modal>
          </NavItem>
        </Nav>

      addCity = null;
      }

      username = this.state.username;
      if (username) {
        submitForm = <SubmitForm endpoint="http://localhost:8000/core/destinations/" username={ username }/>;
      } else {
        submitForm = null;
      }

          //console.log(this.state.cities);
          //this.state.logged_in ? `Hello, ${this.state.username}` : 'Please Log In'
      return (
        <React.Fragment>
          <Navbar color="light" light expand="md">
            <NavbarBrand className="title" href="/">ScrapMap</NavbarBrand>
            <NavbarToggler />
            {form}
          </Navbar>
          <h1 className="quote">
          "To Travel is to Live"
          </h1>
          <Map 
            width={ this.state.width } 
            height={ this.state.height } 
            cities={ this.state.cities }
            logged_in={ this.state.loggedIn }
            handleEditCity={this.handleEditCity}
            handleGetCity={this.handelGetCity}
          />
          <div className="space"></div>
        </React.Fragment>
      );
    }
}

export default Dimensions()(App);
