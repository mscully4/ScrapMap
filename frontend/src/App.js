import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import jwt_decode from "jwt-decode";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import RingLoader from "react-spinners/RingLoader";


import Main from './views/Main';
import Home from './views/Home';
import Test from './views/Test';

import { fetchCurrentUser, fetchToken, putNewUser } from "./utils/fetchUtils"

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrash, faSync, fsEllipsisH, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

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
    console.log("CHORK")
    super(props);

    let token = localStorage.getItem("token");

    this.state = {
      loggedIn: token && (jwt_decode(token).exp > (Date.now() / 1000)) ? true : false,
      loggedInUser: null,
      showLoginModal: false,
      modalSignUp: false,

      loggedInCities: [],
      loggedInPlaces: [],

      width: window.innerWidth * .8,
      height: window.innerHeight * .8,
      ready: false,

      //These need to be here because a new instance of Main is created every time, so the values held in state are lost

    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    if (this.state.loggedIn) {
      this.handleLoadSession()
    } else {
      this.setState({
        ready: true
      })
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
        let places = [], index = 0
        for (var i = 0; i < data.destinations.length; ++i) {
          for (var z = 0; z < data.destinations[i].places.length; ++z) {
            var place = data.destinations[i].places[z];
            places.push({ ...place, index })
            ++index
          }
        }
        this.setState({
          loggedInUser: data.user.username,
          loggedInCities: data.destinations.map((el, i) => {
            el.index = i;
            return el;
          }),
          loggedInPlaces: places,
          ready: true,
        })
      });
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
            loggedInUser: json.user.username,
            loggedInCities: json.destinations.map((el, i) => {
              el.index = i;
              return el;
            }),
          })
        }
      })
  }

  //baseURL + core/users/
  handleSignup = (e, data) => {
    e.preventDefault();
    putNewUser(data)
      .then(json => {
        console.log(json)
        if (json) {
          localStorage.setItem("token", json.token);
          this.setState({
            loggedIn: true,
            loggedInUser: json.username
          })
        }
      })
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({
      loggedIn: false,
      loggedInUser: null,
      showModalLogin: false,
      modalSignUp: false,
      loggedInCities: null,
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

  // changeGranularity = (zoom) => {
  //   this.setState({
  //     granularity: zoom > 11 ? 0 : 1,
  //     mapZoom: zoom,
  //   })
  // }

  compilePlaces = (destinations) => {
    let places = [], index = 0
    for (var i = 0; i < destinations.length; ++i) {
      for (var z = 0; z < destinations[i].places.length; ++z) {
        var place = destinations[i].places[z];
        places.push({ ...place, index })
        ++index
      }
    }
    return places
  }

  renderHome = (props) => {
    console.log(props)
    return (
      <Home
        loggedIn={this.state.loggedIn}
        loggedInUser={this.state.loggedInUser}
        handleLogout={this.handleLogout}
        toggleLogin={this.toggleLogIn}
        toggleSignUp={this.toggleSignUp}
        handleLogin={this.handleLogin}
        handleSignup={this.handleSignup}
      />
    )
  }

  renderMain = (props) => {
    //TODO validate this is the right logic
    console.log(12)
    const user = props.match.params.username;
    const context = user === undefined || user === this.state.loggedInUser ? "Owner" : "Viewer";
    return (
      <Main
        {...props}
        context={context}
        compilePlaces={this.compilePlaces}
        //Navigation Props
        loggedIn={this.state.loggedIn}
        loggedInUser={this.state.loggedInUser}
        loggedInCities={this.state.loggedInCities}
        loggedInPlaces={this.state.loggedInPlaces}
        handleLogout={this.handleLogout}
        toggleLogin={this.toggleLogIn}
        toggleSignUp={this.toggleSignUp}
        handleLogin={this.handleLogin}
        handleSignup={this.handleSignup}
        //view info
        viewUser={user}
        //Map Props
        handleAddCity={this.handleAddCity}
        handleAddPlace={this.handleAddPlace}
        handleEditCity={this.handleEditCity}
        handleDeleteCity={this.handleDeleteCity}
        handleImageOverwrite={this.handleImageOverwrite}
        backendURL={BACKEND_URL}
      />)
  }

  // renderViewer = (username) => {
  //   return (
  //   <Viewer 
  //     loggedIn={this.state.loggedIn} 
  //     username={this.state.username} 
  //     handleLogout={this.handleLogout} 
  //     toggleLogin={this.toggleLogIn}
  //     toggleSignUp={this.toggleSignUp}
  //     handleLogin={this.handleLogin}
  //     handleSignup={this.handleSignup}
  //     username={this.state.username} 
  //     backendURL={BACKEND_URL}
  //     //user info
  //     owner={username}
  //     cities={this.state.cities}
  //     />
  //   )
  // }

  render = () => {
    //this.updateWindowDimensions();
    if (this.state.ready) {
      return (
        <React.Fragment>
          {/* <h1 style={styles.quote}>"To Travel is to BOOF"</h1> */}
          <Router>
            <Switch>
              <Route path="/:username" render={(props) => this.renderMain(props)}></Route>
              {/* <Route path="/test" render={(props) => <Test {...props}/>}></Route> */}
              <Route path="/" render={(props) => this.state.loggedIn ? this.renderMain(props) : this.renderHome(props)}></Route>
            </Switch>
          </Router>
        </React.Fragment>
      )
    } else {
      return (
        <div style={{
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: "#000000",
        }}>
          <RingLoader
            color={"#0095d2"}
            loading={true}
            css={`margin: auto; background-color: #000000; top: ${(window.innerHeight - 500) / 2.5}px`}
            // ; height: ${window.innerHeight}px; width: ${window.innerWidth}px`}
            size={500}
          />
          <p style={{ 
            position: 'absolute',
            left: 0,
            right: 0,
            color: "#0095d2",
            textAlign: 'center',
            fontSize: 50,
            bottom: window.innerHeight *.1,
            opacity: .7
          }}>Loading...</p>
        </div>
      )
    }
  }
}

export default Dimensions()(App);
