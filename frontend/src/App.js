import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import jwt_decode from "jwt-decode";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import RingLoader from "react-spinners/RingLoader";
import {
  fetchCurrentUser,
  fetchToken,
  putNewUser,
  postNewCity,
  putEditCity,
  putEditPlaceAxios,
  deleteCity,
  deletePlace,
  deleteImage,
  getUser,
  postNewPlace,
  // putEditPlace 
} from "./utils/fetchUtils"

import Main from './views/Main';
import Home from './views/Home';
// import Test from './views/Test';

import { city_colors } from "./utils/colors"

import "./App.css";

const BACKEND_URL = "http://localhost:8000";
const DEFAULT_CENTER = { lat: 33.7490, lng: -84.3880 }


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
      loggedIn: token && (jwt_decode(token).exp > (Date.now() / 1000)) ? true : false,
      loggedInUserDataLoaded: false,
      loggedInUser: null,
      // modalSignUp: false,

      loggedInCities: [],
      loggedInPlaces: [],

      viewUser: null,
      viewCities: [],
      viewPlaces: [],

      width: window.innerWidth * .8,
      height: window.innerHeight * .8,
      ready: false,

      loginRequestPending: false,
      signUpRequestPending: false,

      editPlaceRequestPending: false,
      editCityRequestPending: false,

      addCityRequestPending: false,
      addPlaceRequestPending: false,

      deleteCityRequestPending: false,
      deletePlaceRequestPending: false,
      deleteImageRequestPending: false,

      showError: false,
      errorMessage: "",
    }

    this.setPreparedImages = null
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

  setError = (error, errorMessage) => {
    this.setState({
      showError: error,
      errorMessage: errorMessage
    })
  }

  handleLoadSession = (e) => {
    fetchCurrentUser(localStorage.getItem("token"))
      .then(data => {
        console.log(data)
        const places = this.compilePlaces(data.destinations)
        this.setState({
          loggedInUser: data.user.username,
          loggedInCities: data.destinations.map((el, i) => {
            el.index = i;
            el.color = city_colors[Math.floor(Math.random() * city_colors.length)]
            return el;
          }),
          loggedInPlaces: places,
          loggedInUserDataLoaded: true,
          ready: true,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          showError: true,
          errorMessage: err,
          ready: true
        })
      })
  }

  // baseURL + token-auth/
  handleLogin = (e, data) => {
    e.preventDefault();
    this.setState({
      loginRequestPending: true
    })

    fetchToken(data)
      .then(json => {
        localStorage.setItem('token', json.token);
        const places = this.compilePlaces(json.destinations)
        this.setState({
          loggedIn: true,
          loggedInUser: json.user.username,
          loggedInCities: json.destinations.map((el, i) => {
            el.index = i;
            el.color = city_colors[Math.floor(Math.random() * city_colors.length)]
            return el;
          }),
          loggedInPlaces: places,
          loginRquestPending: false,
          loggedInUserDataLoaded: true,
        })
      })
      .catch(err => {
        this.setState({
          showError: true,
          errorMessage: err,
          loginRequestPending: false
        })
        console.log(err)
      })
  }

  //baseURL + core/users/
  handleSignUp = (e, data) => {
    e.preventDefault();
    this.setState({
      loadingSignupRequest: true
    })
    putNewUser(data)
      .then(json => {
        localStorage.setItem("token", json.token);
        this.setState({
          loggedIn: true,
          loggedInUser: json.username,
          loggedInCities: [],
          loggedInPlaces: [],
          loadingSignupRequest: false,
          loggedInUserDataLoaded: true

        })
      })
      .catch(err => {
        this.setState({
          showError: true,
          errorMessage: err
        })
        console.log(err)
      })
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({
      loggedIn: false,
      loggedInUser: null,
      loggedInCities: null,
    })
  };

  //The intermediary function for adding new cities
  handleAddCity = (e, data) => {
    e.preventDefault();
    //As a precaution, make sure the user is Logged In
    if (this.state.loggedIn) {
      //This will prevent users spamming the submit button
      this.setState({
        addCityRequestPending: true,
      }, () => {
        //Hit the /core/destinations/ endpoint with a post request to add the new city
        postNewCity(localStorage.getItem('token'), data)
          .then(res => {
            //Change state to reflect the changes
            this.setState({
              loggedInCities: this.state.loggedInCities.concat([{
                ...res, index: this.state.loggedInCities.length, color: city_colors[Math.floor(Math.random() * city_colors.length)]
              }]),
              mapZoom: 4,
              mapCenter: { lat: res.latitude, lng: res.longitude },
              addCityRequestPending: false
            }, () => console.log(this.state))
          })
          .catch(err => {
            this.setState({
              showError: true,
              errorMessage: err
            }) 
            console.log(err) 
          })
      })
    }
  }

  //The intermediary function for adding new places
  handleAddPlace = (e, data) => {
    e.preventDefault()
    //Put all the data in an object
    const payload = {
      destination: data.closestCity.pk,
      name: data.name,
      address: data.address,
      city: data.closestCity.city,
      county: data.county,
      state: data.state,
      country: data.country,
      zip_code: data.zip_code,
      latitude: data.latitude,
      longitude: data.longitude,
      types: data.types,
      placeId: data.placeId,
      main_type: data.main_type
    }
    //Let the application know there is an outstanding request, this is used to prevent spamming the submit button
    this.setState({
      addPlaceRequestPending: true
    }, () => {
      //Hit the /core/places/ endpoint with a POST to add a new place
      postNewPlace(localStorage.getItem('token'), payload)
        .then(res => {
          //Update state to reflect changes
          this.setState({
            loggedInPlaces: this.state.loggedInPlaces.concat([{ ...res, index: this.state.loggedInPlaces.length }]),
            loggedInCities: this.state.loggedInCities.map(obj => obj.pk === res.destination ? { ...obj, places: obj.places.concat([res]) } : obj),
            addPlaceRequestPending: false
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            showError: true,
            errorMessage: err
          })
        })
    })
  }

  //The intermediary function for editing cities
  handleEditCity = (e, data) => {
    e.preventDefault();

    //Let the application know there is an outstanding request, this is used to prevent spamming the submit button
    this.setState({
      editCityRequestPending: true
    }, () =>
      //Hit the /core/destination/:pk/ endpoint with a PUT request
      putEditCity(localStorage.getItem('token'), data)
        .then(json => {
          //Update state to reflect changes
          this.setState({
            loggedInCities: this.state.loggedInCities.map(el => {
              const color = el.color
              return el.pk === json.pk ? { ...json, color } : el
            }),
            loggedInPlaces: this.compilePlaces(json),
            editCityRequestPending: false
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            showError: true,
            errorMessage: err
          })
        })
    )
  }

  //The intermediary function for editing cities and uploading images
  handleEditPlace = (e, data) => {
    e.preventDefault();
    //Let the application know there is an outstanding request, this is used to prevent spamming the submit button
    this.setState({
      editPlaceRequestPending: true,
    }, () => {
      //Hit the /core/place/:pk/ endpoint with a PUT request to edit the place/upload images
      putEditPlaceAxios(localStorage.getItem('token'), data)
        //Update state to reflect the changes
        .then(json => {
          this.setState({
            loggedInCities: json.data.map((el, i) => { return { ...el, index: i } }),
            loggedInPlaces: this.compilePlaces(json.data),
            editPlaceRequestPending: false,
          })
        })
        .catch(err => {
          this.setState({
            showError: true,
            editCityRequestPending: false,
            errorMessage: err

          })
        })
    })
  }

  //The intermediary funcction for deleting cities
  handleDeleteCity = (e, data) => {
    e.preventDefault();

    this.setState({
      deleteCityRequestPending: true
    }, () => {
      //Hit the /core/destination/:pk/ endpoint with a DELETE request
      deleteCity(localStorage.getItem('token'), data)
        .then(json => {
          //Update state to reflect the changes
          const destinations = this.state.loggedInCities.filter(el => el.pk !== json.pk)
          this.setState({
            loggedInCities: destinations,
            loggedInPlaces: this.compilePlaces(destinations),
            deleteCityRequestPending: false
          }, () => console.log(this.state))
        })
        .catch(err => {
          console.log(err)
          this.setState({
            deleteCityRequestPending: false,
            showError: true,
            errorMessage: err
          })
        })

    })
  }

  //The intermdiary function for deleting places
  handleDeletePlace = (e, data) => {
    e.preventDefault();
    this.setState({
      deletePlaceRequestPending: true
    }, () => {
      //hit the /core/place/:pk/ endpoint with a DELETE request
      deletePlace(localStorage.getItem('token'), data)
        .then(json => {
          //remove the deleted place from the list of cities
          const destinations = this.state.loggedInCities.map(el => {
            el.places = el.places.filter(obj => json.pk !== obj.pk)
            return el
          })
          this.setState({
            loggedInCities: destinations,
            loggedInPlaces: this.compilePlaces(destinations),
            deletePlaceRequestPending: false
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            showError: true,
            deletePlaceRequestPending: false,
            errorMessage: err
          })
        })
    })
  }

  //The intermediary function for deleting images
  handleDeleteImage = (e, data) => {
    e.preventDefault();
    this.setState({
      deleteImageRequestPending: true,
    }, () => {

      deleteImage(localStorage.getItem('token'), data)
        .then(json => {
          //Find the place that houses the image
          const obj = this.state.loggedInPlaces.find(obj => obj.pk === json.place)

          //Remove the image from the place
          obj.images = obj.images.filter(el => el.pk !== json.id)

          const destinations = this.state.loggedInCities.map(city => {
            //swap out the old place for the new
            city.places = city.places.map(place => {
              return place.pk === json.place ? obj : place
            })
            return city
          })

          this.setPreparedImages(obj.images)

          //Update state to reflect the changes
          this.setState({
            viewCities: destinations,
            viewPlaces: this.compilePlaces(destinations),
            deleteImageRequestPending: false,
          })
        })
        .catch(err => {
          this.setState({
            showError: true,
            deleteImageRequestPending: false,
            errorMessage: err
          })
        })
    })
  }

  preparedImagesSetter = (func) => {
    this.setPreparedImages = func
  }



  // handleImageOverwrite = (img, dataURL) => {
  //   // const username = this.state.username;
  //   // return new Promise(function(resolve, reject) {
  //   //   const buf = new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ""),'base64')
  //   //   const type = dataURL.split(';')[0].split('/')[1];


  //   //   var params = {
  //   //     Bucket: "scrapmap",
  //   //     Key: `${username}/${img.name}`, 
  //   //     Body: buf,
  //   //     ContentEncoding: 'base64',
  //   //     ContentType: `image/${type}`
  //   //   };
  //   //   s3Bucket.putObject(params, function(err, data){
  //   //     if (err) return reject(err)
  //   //     else return resolve(params)
  //   //   })
  //   // })
  // }

  // // changeGranularity = (zoom) => {
  // //   this.setState({
  // //     granularity: zoom >   toggleLogin: false,
  // //     mapZoom: zoom,
  // //   })
  // // }

  renderHome = (props) => {
    return (
      <Home
        loggedIn={this.state.loggedIn}
        loggedInUser={this.state.loggedInUser}
        handlers={{
          logout: this.handleLogout,
          login: this.handleLogin,
          signUp: this.handleSignUp
        }}
        pendingRequests={{
          login: this.state.loginRequestPending,
          signUp: this.state.signUpRequestPending
        }}
        loggedInUserDataLoaded={this.state.loggedInUserDataLoaded}
        showError={this.state.showError}
        errorMessage={this.state.errorMessage}

      />
    )
  }

  renderMain = (props) => {
    const user = props.match.params.username;
    const context = user === undefined || user === this.state.loggedInUser ? "Owner" : "Viewer";
    if (user !== this.state.loggedInUser && user !== this.state.viewUser && !this.state.showError) {
      getUser(localStorage.getItem("token"), user)
        .then(data => {
          const cities = data.map((el, i) => {
            return {
              ...el,
              index: i,
              color: city_colors[Math.floor(Math.random() * city_colors.length)]
            }
          })

          this.setState({
            viewUser: user,
            viewCities: cities,
            viewPlaces: this.compilePlaces(data)
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            errorMessage: err,
            showError: true,
          })
        })
    }
    return (
      <Main
        {...props}
        owner={this.state.loggedInUser === user}
        //Navigation Props
        loggedIn={this.state.loggedIn}
        loggedInUser={this.state.loggedInUser}
        loggedInUserDataLoaded={this.state.loggedInUserDataLoaded}
        handlers={{
          logout: this.handleLogout,
          login: this.handleLogin,
          signUp: this.handleSignUp,
          addCity: this.handleAddCity,
          addPlace: this.handleAddPlace,
          editCity: this.handleEditCity,
          editPlace: this.handleEditPlace,
          deleteCity: this.handleDeleteCity,
          deletePlace: this.handleDeletePlace,
          deleteImage: this.handleDeleteImage
        }}
        //view info
        viewUser={user}
        viewPlaces={user === this.state.loggedInUser ? this.state.loggedInPlaces : this.state.viewPlaces}
        viewCities={user === this.state.loggedInUser ? this.state.loggedInCities : this.state.viewCities}
        //Handler Functions
        handleAddCity={this.handleAddCity}
        handleAddPlace={this.handleAddPlace}
        handleEditCity={this.handleEditCity}
        handleEditPlace={this.handleEditPlace}
        handleDeleteCity={this.handleDeleteCity}
        handleDeletePlace={this.handleDeletePlace}
        handleDeleteImage={this.handleDeleteImage}
        preparedImagesSetter={this.preparedImagesSetter}
        //Pending Requests
        pendingRequests={{
          login: this.state.loginRequestPending,
          signUp: this.state.signUpRequestPending,
          addPlace: this.state.addPlaceRequestPending,
          addCity: this.state.addCityRequestPending,
          editPlace: this.state.editPlaceRequestPending,
          editCity: this.state.editCityRequestPending,
          deletePlace: this.state.deletePlaceRequestPending,
          deleteCity: this.state.deleteCityRequestPending,
          deleteImage: this.state.deleteImageRequestPending,
        }}
        showError={this.state.showError}
        errorMessage={this.state.errorMessage}
        setError={this.setError}
      />)
  }

  render = () => {
    //this.updateWindowDimensions();
    if (this.state.ready) {
      return (
        <React.Fragment>
          <Router>
            <Switch>
              <Route path="/liveliness" render={(props) => <div></div>}></Route>
              <Route path="/:username" render={(props) => this.renderMain(props)}></Route>
              <Route path="/" render={(props) => this.renderHome(props)}></Route>
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
            size={500}
          />
          <p style={{
            position: 'absolute',
            left: 0,
            right: 0,
            color: "#0095d2",
            textAlign: 'center',
            fontSize: 50,
            bottom: window.innerHeight * .1,
            opacity: .7
          }}>Loading...</p>
        </div>
      )
    }
  }
}

export default Dimensions()(App);
