import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import jwt_decode from "jwt-decode";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Owner from './views/Owner';
import Viewer from './views/Viewer';
import Home from './views/Home'

import {fetchCurrentUser, fetchToken, putNewUser, postNewCity, putEditCity, deleteCity } from "./utils/fetchUtils" 

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrash, faSync, fsEllipsisH, faEllipsisH  } from '@fortawesome/free-solid-svg-icons';

import "./App.css";

library.add(faEdit);
library.add(faTrash);
library.add(faSync);
library.add(faEllipsisH)

const BACKEND_URL = "http://localhost:8000";

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
  dirName: 'media', /* optional */
  region: 'us-east-1',
  accessKeyId: 'AKIA2WIZHBHNCAZFMXVM',
  secretKeyAccess: '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',
  s3Url: 'http://scrapmap.s3.amazonaws.com/', /* optional */
}

// var AWS = require('aws-sdk/dist/aws-sdk-react-native');
// AWS.config.update({ accessKeyId: config.accessKeyId, secretAccessKey: config.secretKeyAccess, region: config.region })
// var s3Bucket = new AWS.S3( { params: {Bucket: config.bucketName} } );

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
      this.handleLoadSession()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
      this.setState({ width: window.innerWidth * .8, height: window.innerHeight * .8 });
  }

  handleLoadSession = (e) => {
    fetchCurrentUser(localStorage.getItem("token"))
      .then(data => {
        console.log(data)
        this.setState({ 
          username: data.user.username, 
          cities: data.destinations.map((el, i) => {
            el.index=i;
            return el;
          })
        })
      });
  }

    // baseURL + token-auth/
  handleLogin = (e, data) => {
    e.preventDefault();

    fetchToken(data)
    .then(json => {
      // console.log(json.token)
      if (json) {
        console.log(json)
        localStorage.setItem('token', json.token);
        this.setState({
          loggedIn: true,
          username: json.user.username,
          cities: json.destinations.map((el, i) => {
            el.index = i;
            return el;
          }),
        }, () => console.log(this.state))
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
          res.index=this.state.cities.length;
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
      console.log(json, this.state.cities)
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
        cities: json.destinations.map((el, i) => {
          el.index = i;
          return el;
        }),
      })
    })
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({
      loggedIn: false,
      username: null,
      showModalLogin: false,
      modalSignUp: false,
      cities: null,
    })
  };

  handleImageOverwrite = (img, dataURL) => {
    console.log(img)
    // const username = this.state.username;
    // return new Promise(function(resolve, reject) {
    //   const buf = new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ""),'base64')
    //   const type = dataURL.split(';')[0].split('/')[1];
      

    //   var params = {
    //     Bucket: "scrapmap",
    //     Key: `${username}/${img.name}`, 
    //     Body: buf,
    //     ContentEncoding: 'base64',
    //     ContentType: `image/${type}`
    //   };
    //   s3Bucket.putObject(params, function(err, data){
    //     if (err) return reject(err)
    //     else return resolve(params)
    //   })
    // })
  }

  renderHome = () => {
    return (
      <Home
      loggedIn={this.state.loggedIn} 
      username={this.state.username} 
      handleLogout={this.handleLogout} 
      toggleLogin={this.toggleLogIn}
      toggleSignUp={this.toggleSignUp}
      handleLogin={this.handleLogin}
      handleSignup={this.handleSignup}
      username={this.state.username} 
      />
    )
  }

  renderOwner = (username) => {
    return (
      <Owner
      //Navigation Props
      loggedIn={this.state.loggedIn} 
      username={this.state.username} 
      handleLogout={this.handleLogout} 
      toggleLogin={this.toggleLogIn}
      toggleSignUp={this.toggleSignUp}
      handleLogin={this.handleLogin}
      handleSignup={this.handleSignup}
      //user info
      u={username}
      cities={this.state.cities}
      //Map Props
      handleAddCity={this.handleAddCity} 
      handleEditCity={this.handleEditCity}
      handleDeleteCity={this.handleDeleteCity}
      handleImageOverwrite={this.handleImageOverwrite}
      backendURL={BACKEND_URL}
      />)
  }

  renderViewer = (username) => {
    return (
    <Viewer 
      loggedIn={this.state.loggedIn} 
      username={this.state.username} 
      handleLogout={this.handleLogout} 
      toggleLogin={this.toggleLogIn}
      toggleSignUp={this.toggleSignUp}
      handleLogin={this.handleLogin}
      handleSignup={this.handleSignup}
      username={this.state.username} 
      backendURL={BACKEND_URL}
      //user info
      owner={username}
      cities={this.state.cities}
      />
    )
  }

  render = () => {
    //this.updateWindowDimensions();
    
    return (
      <React.Fragment>
        {/* <Navigation 
          loggedIn={this.state.loggedIn} 
          username={this.state.username} 
          handleLogout={this.handleLogout} 
          toggleLoggedIn={this.toggleLogIn}
          toggleSignUp={this.toggleSignUp}
          handleLogin={this.handleLogin}
          handleSignup={this.handleSignup}
          username={this.state.username}
        /> */}
        {/* <h1 style={styles.quote}>"To Travel is to BOOF"</h1> */}

        <Router>
          <Switch>
            <Route path="/:username" component={(obj) => {
              console.log(this.state.username, obj.match.params.username)
              return this.state.username == obj.match.params.username ? this.renderOwner() : this.renderViewer(obj.match.params.username)
            }}>
              {/* // return (
              //   <Owner 
              //   //Navigation Props
              //   loggedIn={this.state.loggedIn} 
              //   username={this.state.username} 
              //   handleLogout={this.handleLogout} 
              //   toggleLogin={this.toggleLogIn}
              //   toggleSignUp={this.toggleSignUp}
              //   handleLogin={this.handleLogin}
              //   handleSignup={this.handleSignup}
              //   username={this.state.username}
              //   //user info
              //   u={obj.match.params.username}
              //   // width={this.state.width}
              //   // height={this.state.height}
              //   cities={this.state.cities}
              //   //Map Props
              //   handleAddCity={this.handleAddCity} 
              //   handleEditCity={this.handleEditCity}
              //   handleDeleteCity={this.handleDeleteCity}
              //   handleImageOverwrite={this.handleImageOverwrite}
              //   backendURL={BACKEND_URL} */}
          </Route>
          <Route path="/" component={() => this.state.loggedIn ? this.renderOwner() : this.renderHome()}></Route>
        </Switch>
      </Router>


        
        <div style={styles.space}></div>
      </React.Fragment>
    );
  }
}

export default Dimensions()(App);
