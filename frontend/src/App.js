import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import jwt_decode from "jwt-decode";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Main from './views/Main';
import Home from './views/Home'

import {fetchCurrentUser, fetchToken, putNewUser, postNewCity, putEditCity, deleteCity, getUser, postNewPlace, putEditPlace } from "./utils/fetchUtils" 

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
    console.log("CHORK")
    super(props);
    
    let token = localStorage.getItem("token");

    this.state = {
      loggedIn: token && (jwt_decode(token).exp > (Date.now()/1000)) ? true : false,
      loggedInUser: null,
      showLoginModal: false,
      modalSignUp: false,

      loggedInCities: [],
      loggedInPlaces: [],

      width: window.innerWidth * .8,
      height: window.innerHeight * .8,
      ready: false,

      //These need to be here because a new instance of Main is created every time, so the values held in state are lost
      granularity: 0,
      mapZoom: 4,
      mapCenter: {
        lat: 33.7490, 
        lng: -84.3880
      },
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
        for (var i=0; i<data.destinations.length; ++i) {
          for (var z=0; z<data.destinations[i].places.length; ++z) {
            var place = data.destinations[i].places[z];
            places.push({...place, index})
            ++index
          }
        }
        this.setState({ 
          loggedInUser: data.user.username, 
          loggedInCities: data.destinations.map((el, i) => {
            el.index=i;
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
      // console.log(json.token)
      if (json) {
        console.log(json)
        localStorage.setItem('token', json.token);
        this.setState({
          loggedIn: true,
          loggedInUser: json.user.username,
          loggedInCities: json.destinations.map((el, i) => {
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
          loggedInUser: json.username
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
          res.index=this.state.loggedInCities.length;
          this.setState({
            loggedInCities: this.state.loggedInCities.concat([res])
          })
        }
      })
    }
  }

  handleAddPlace = (e, data) => {
    e.preventDefault()
    const payload = 
      {
        destination: data.closestCity.pk,
        name: data.name,
        number: data.number,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.closestCity.city,
        state: data.state,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude
      }
    if (this.state.loggedIn) {
      postNewPlace(localStorage.getItem('token'), payload)
      .then(res => {
        this.setState({
          loggedInPlaces: this.state.loggedInPlaces.concat([res])
        })
      })
    }
  }

  handleEditCity = (e, data) => {
    e.preventDefault();
    putEditCity(localStorage.getItem('token'), data)
    .then(json => {
      console.log(json, this.state.loggedInCities)
      this.setState({
        loggedInCities: this.state.loggedInCities.map(el => el.pk === json.pk ? json : el)
      })
    })
  }

  handleEditPlace = (e, data) => {
    e.preventDefault();
    putEditPlace(localStorage.getItem('token'), data)
    .then(json => {
      console.log(json)
      // this.setState({
      //   cities: this.state.cities.map(el => el.pk === json.pk ? json : el)
      // })
    })
  }

  handleDeleteCity = (e, data) => {
    e.preventDefault();
    deleteCity(localStorage.getItem('token'), data)
    .then(json => {
      this.setState({
        //why is this json.destinations?
        loggedInCities: json.destinations.map((el, i) => {
          el.index = i;
          return el
        }),
      })
    })
  }

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

  changeMapConfig = (center, zoom) => {
    // this.setState({
    //   mapCenter: {
    //     lat: center.latitude,
    //     lng: center.longitude
    //   },
    //   granularity: zoom > 11 ? 0 : 1,
    //   mapZoom: zoom,
    // })
    this.setState({
      mapCenter: {
        lat: center.lat,
        lng: center.lng
      },
      granularity: zoom > 11 ? 0 : 1,
      mapZoom: zoom,
    })
  }

  renderHome = () => {
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

  renderMain = (user) => {
    return (
      <Main
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
      //Storage for Main
      mapZoom={this.state.mapZoom}
      mapCenter={this.state.mapCenter}
      changeMapConfig={this.changeMapConfig}
      granularity={this.state.granularity}

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
    console.log(this.state.ready)
    //this.updateWindowDimensions();
    if (this.state.ready) {
      return (
        <React.Fragment>
          {/* <h1 style={styles.quote}>"To Travel is to BOOF"</h1> */}
          <Router>
            <Switch>
              <Route path="/:username" component={(obj) => this.renderMain(obj.match.params.username)}></Route>
              <Route path="/" component={() => this.state.loggedIn ? this.renderMain() : this.renderHome()}></Route>
            </Switch>
          </Router>  
          <div style={styles.space}></div>
        </React.Fragment>
      )
    } else {
      return <div></div>
    }
  }
}

export default Dimensions()(App);
