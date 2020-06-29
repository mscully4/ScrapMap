import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import jwt_decode from "jwt-decode";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import queryString from 'query-string'
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
  getUserDebounced,
  postNewPlace,
  uploadImage,
  // putEditPlace 
} from "./utils/fetchUtils"

import Main from './views/Main';
import Home from './views/Home';
import PasswordReset from './views/PasswordReset';
import { city_colors, ICE_BLUE } from "./utils/colors"
import "./App.css";

const baseURL = window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000/' : `${window.location.origin}/backend/`
const DEFAULT_CENTER = { lat: 33.7490, lng: -84.3880 }

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

      dataChanged: false,

      ready: false,

      loginRequestPending: false,
      loginError: null,
      signUpRequestPending: false,
      signUpError: null,

      editPlaceRequestPending: false,
      editCityRequestPending: false,

      uploadImageRequestPending: false,

      addCityRequestPending: false,
      addPlaceRequestPending: false,

      deleteCityRequestPending: false,
      deletePlaceRequestPending: false,
      deleteImageRequestPending: false,

      error: {
        show: false,
        status: 0,
        statusText: "",
        message: {}
      }
    }

    this.setPreparedImages = null
    this.changeMapCenter = null
    this.changeGranularity = null
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
        place.images = place.images.map((obj, i) => {
          return { ...obj, index: i }
        })
        places.push({ ...place, index })
        ++index
      }
    }
    return places
  }

  setError = (error) => {
    this.setState({
      error: error
    })
  }

  handleErrors = (response) => {
    if (this.state.error.show === true) {
      throw Error`${response.status}: ${response.statusText}`
    } else if (response.status >= 500) {
      this.setState({
        error: {
          status: response.status,
          statusText: response.statusText,
          show: true,
          message: "Internal Server Error"
        }
      })
      throw Error(`${response.status}: ${response.statusText}`)
    } else if (response.status >= 400) {
      response.json()
        .then(json => {
          this.setState({
            error: {
              status: response.status,
              statusText: response.statusText,
              show: false,
              message: json
            }
          })
        })
      throw Error(`${response.status}: ${response.statusText}`)
    } else {
      return response.json()
    }
  }

  handleLoadSession = (e) => {
    fetchCurrentUser(localStorage.getItem("token"))
      .then(this.handleErrors)
      .then(data => {
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
        this.setState({
          ready: true,
        })
        //this will only execute if there is a network error
        if (this.state.error.show === false) {
          this.setState({
            error: {
              show: true,
              status: "net",
              statusText: "ERR_CONNECTION_REFUSED",
              message: "Network Error"
            }
          })
        }
      })
  }

  // baseURL + token-auth/
  handleLogin = (e, data) => {
    e.preventDefault();
    this.setState({
      loginRequestPending: true
    })

    fetchToken(data)
      .then(this.handleErrors)
      .then(json => {
        if (json.token) localStorage.setItem('token', json.token);
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
          loginRequestPending: false,
          loggedInUserDataLoaded: true,
        })
      })
      .catch(err => {
        this.setState({
          loginRequestPending: false,
        })

        //this will only execute if there is a network error
        if (this.state.error.show === false) {
          this.setState({
            error: {
              show: true,
              status: "net",
              statusText: "ERR_CONNECTION_REFUSED",
              message: "Network Error"
            }
          })
        }
      })
  }

  //The intermediary function for adding new users
  handleSignUp = (e, data) => {
    e.preventDefault();
    this.setState({
      //Prevent the user from spamming requests
      loadingSignupRequest: true
    }, () => {
      //Hit the /core/users/ endpoint with a POST request
      putNewUser(data)
        .then(this.handleErrors)
        .then(json => {
          if (json.token) localStorage.setItem("token", json.token);
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
          console.log(err)
          this.setState({
            loadingSignupRequest: false
          })

          //this will only execute if there is a network error
          if (this.state.error.show === false) {
            this.setState({
              error: {
                show: true,
                status: "net",
                statusText: "ERR_CONNECTION_REFUSED",
                message: "Network Error"
              }
            })
          }
        })
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
    //This will prevent users spamming the submit button
    this.setState({
      addCityRequestPending: true,
    }, () => {
      //Hit the /core/destinations/ endpoint with a post request to add the new city
      postNewCity(localStorage.getItem('token'), data)
        .then(this.handleErrors)
        .then(data => {
          //Change state to reflect the changes
          this.setState({
            loggedInCities: this.state.loggedInCities.concat([{
              ...data, index: this.state.loggedInCities.length, color: city_colors[Math.floor(Math.random() * city_colors.length)]
            }]),
            mapZoom: 4,
            mapCenter: { lat: data.latitude, lng: data.longitude },
            addCityRequestPending: false,
            dataChanged: true
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            addCityRequestPending: false,
          })

          //this will only execute if there is a network error
          if (this.state.error === false) {
            this.setState({
              error: {
                show: true,
                status: "net",
                statusText: "ERR_CONNECTION_REFUSED",
                message: "Network Error"
              }
            })
          }
        })
    })
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
        .then(this.handleErrors)
        .then(data => {
          //Update state to reflect changes
          this.setState({
            loggedInPlaces: this.state.loggedInPlaces.concat([{ ...data, index: this.state.loggedInPlaces.length }]),
            loggedInCities: this.state.loggedInCities.map(obj => obj.pk === data.destination ? { ...obj, places: obj.places.concat([data]) } : obj),
            addPlaceRequestPending: false,
            dataChanged: true
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            addPlaceRequestPending: false
          })

          //This will only execute if there is a network error
          if (this.state.error.show === false) {
            this.setState({
              error: {
                show: true,
                status: "net",
                statusText: "ERR_CONNECTION_REFUSED",
                message: "Network Error"
              }
            })
          }
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
        .then(this.handleErrors)
        .then(data => {
          //Update state to reflect changes
          this.setState({
            loggedInCities: this.state.loggedInCities.map(el => {
              const color = el.color
              return el.pk === data.pk ? { ...data, color } : el
            }),
            editCityRequestPending: false,
            dataChanged: true
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            editCityRequestPending: false,
          })

          //this will only execute if there is a network error
          if (this.state.error.show === false) {
            this.setState({
              error: {
                show: true,
                status: "net",
                statusText: "ERR_CONNECTION_REFUSED",
                message: "Network Error"
              }
            })
          }
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
        .then(res => {
          const data = res.data

          //update the place in state
          const destinations = this.state.loggedInCities.map(el => {
            el.places = el.places.map(obj => data.pk === obj.pk ? data : obj)
            return el
          })

          this.setState({
            loggedInCities: destinations,
            loggedInPlaces: this.compilePlaces(destinations),
            editPlaceRequestPending: false,
            dataChanged: true
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            editPlaceRequestPending: false,
          })
        })
    })
  }

  handleUploadImage = (e, data, uploadProgress) => {
    this.setState({
      uploadImageRequestPending: true
    }, () => {
      uploadImage(localStorage.getItem('token'), data, uploadProgress)
        .then(response => {
          const data = response.data
          const destinations = this.state.loggedInCities.map(el => {
            el.places = el.places.map(obj => obj.pk === data.pk ? data : obj)
            return el
          })
          this.setState({
            uploadImageRequestPending: false,
            loggedInCities: destinations,
            loggedInPlaces: this.compilePlaces(destinations),
            dataChanged: true
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            error: {
              show: true,
              status: 500,
              statusText: 'Interal Server Error',
              message: 'Internal Server Error'
            }
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
        .then(this.handleErrors)
        .then(data => {
          //Update state to reflect the changes
          const destinations = this.state.loggedInCities.filter(el => el.pk !== data.pk)
          this.setState({
            loggedInCities: destinations,
            loggedInPlaces: this.compilePlaces(destinations),
            deleteCityRequestPending: false,
            dataChanged: true
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            deleteCityRequestPending: false,
          })

          //this will only execute if there is a network error
          if (this.state.error.show === false) {
            this.setState({
              error: {
                show: true,
                status: "net",
                statusText: "ERR_CONNECTION_REFUSED",
                message: "Network Error"
              }
            })
          }
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
        .then(this.handleErrors)
        .then(data => {
          //remove the deleted place from the list of cities
          const destinations = this.state.loggedInCities.map(el => {
            el.places = el.places.filter(obj => data.pk !== obj.pk)
            return el
          })
          this.setState({
            loggedInCities: destinations,
            loggedInPlaces: this.compilePlaces(destinations),
            deletePlaceRequestPending: false,
            dataChanged: true
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            deletePlaceRequestPending: false,
          })

          //this will only execute if there is a network error
          if (this.state.error.show === false) {
            this.setState({
              error: {
                show: true,
                status: "net",
                statusText: "ERR_CONNECTION_REFUSED",
                message: "Network Error"
              }
            })
          }
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
        .then(this.handleErrors)
        .then(data => {
          //Find the place that houses the image
          const obj = this.state.loggedInPlaces.find(obj => obj.pk === data.place)

          //Remove the image from the place
          obj.images = obj.images.filter(el => el.pk !== data.id)

          const destinations = this.state.loggedInCities.map(city => {
            //swap out the old place for the new
            city.places = city.places.map(place => {
              return place.pk === data.place ? obj : place
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
          console.log(err)
          this.setState({
            deleteImageRequestPending: false,
          })

          //this will only execute if there is a network error
          if (this.state.error.show === false) {
            this.setState({
              error: {
                show: true,
                status: "net",
                statusText: "ERR_CONNECTION_REFUSED",
                message: "Network Error"
              }
            })
          }

        })
    })
  }

  setPreparedImagesSetter = (func) => {
    this.setPreparedImages = func
  }

  changeMapCenterSetter = (func) => {
    this.changeMapCenter = func
  }

  changeGranularitySetter = (func) => {
    this.changeGranularity = func
  }

  renderPasswordReset = (props) => {
    const values = queryString.parse(props.location.search)
    return (
      <PasswordReset
        token={values.token}
        baseURL={baseURL}
      />
    )
  }

  renderHome = (props) => {
    return (
      <Home
        loggedInInfo={{
          loggedIn: this.state.loggedIn,
          user: this.state.loggedInUser,
          dataLoaded: this.state.loggedInUserDataLoaded
        }}
        handlers={{
          logout: this.handleLogout,
          login: this.handleLogin,
          signUp: this.handleSignUp
        }}
        pendingRequests={{
          login: this.state.loginRequestPending,
          signUp: this.state.signUpRequestPending
        }}
        error={this.state.error}
        setError={this.setError}
      />
    )
  }

  renderMain = (props) => {
    const user = props.match.params.username;
    //If redirecting to Logged In User's Page, make sure that viewUser is set to LooggedInUser
    if (user === this.state.loggedInUser && (user !== this.state.viewUser || this.state.dataChanged)) {
      const viewUser = this.state.viewUser
      this.setState({
        viewUser: user,
        viewCities: this.state.loggedInCities,
        viewPlaces: this.state.loggedInPlaces,
        dataChanged: false
      })

      if (this.changeMapCenter && user !== viewUser) {
        this.changeMapCenter({
          latitude: this.state.loggedInCities.length > 0 ? this.state.loggedInCities[0].latitude : DEFAULT_CENTER.latitude,
          longitude: this.state.loggedInCities.length > 0 ? this.state.loggedInCities[0].longitude : DEFAULT_CENTER.longitude
        })
      }
      if (this.changeGranularity && user !== viewUser) {
        this.changeGranularity(4)
      }

    }
    //If redirecting to a user's page that is not the viewUser, load this user's data
    else if (user !== this.state.viewUser && !this.state.showError) {
      getUserDebounced(localStorage.getItem("token"), user)
        //Overriding the default error handling behavior, if the user being searched for does not exists, show a pop-up
        .then(resp => {
          const response = resp.clone()
          if (this.state.error.show === true) {
            throw Error`${response.status}: ${response.statusText}`
          } else if (response.status === 404 && this.state.error.show !== true) {
            this.setState({
              error: {
                show: true,
                status: 404,
                statusText: "Not Found",
                message: `No User ${user} Exists`
              }
            })
            throw Error`${response.status}: ${response.statusText}`
          }
          return response
        })
        .then(this.handleErrors)
        .then(data => {
          const cities = data.map((el, i) => {
            return {
              ...el,
              index: i,
              color: city_colors[Math.floor(Math.random() * city_colors.length)]
            }
          })

          //Update the user data in state
          this.setState({
            viewUser: user,
            viewCities: cities,
            viewPlaces: this.compilePlaces(data)
          })

          //Change the map center to the first city returned for the user
          if (this.changeMapCenter) {
            this.changeMapCenter({
              latitude: cities.length > 0 ? cities[0].latitude : DEFAULT_CENTER.latitude,
              longitude: cities.length > 0 ? cities[0].longitude : DEFAULT_CENTER.longitude
            })
          }

          if (this.changeGranularity) {
            this.changeGranularity(4)
          }
        })
        .catch(err => {
          console.log(err)
          //this will only execute if there is a network error
          if (this.state.error.show === false) {
            this.setState({
              error: {
                show: true,
                status: "net",
                statusText: "ERR_CONNECTION_REFUSED",
                message: "Network Error"
              }
            })
          }
        })
    }

    return (
      <Main
        {...props}
        owner={this.state.loggedInUser === user}
        loggedInInfo={{
          loggedIn: this.state.loggedIn,
          user: this.state.loggedInUser,
          userDataLoaded: this.state.loggedInUserDataLoaded,
          userCities: this.state.loggedInCities
        }}
        handlers={{
          logout: this.handleLogout,
          login: this.handleLogin,
          signUp: this.handleSignUp,
          addCity: this.handleAddCity,
          addPlace: this.handleAddPlace,
          editCity: this.handleEditCity,
          editPlace: this.handleEditPlace,
          uploadImage: this.handleUploadImage,
          deleteCity: this.handleDeleteCity,
          deletePlace: this.handleDeletePlace,
          deleteImage: this.handleDeleteImage
        }}
        viewInfo={{
          user: user,
          places: this.state.viewPlaces,
          cities: this.state.viewCities
        }}
        setters={{
          setPreparedImages: this.setPreparedImagesSetter,
          changeMapCenter: this.changeMapCenterSetter,
          changeGranularity: this.changeGranularitySetter
        }}
        pendingRequests={{
          login: this.state.loginRequestPending,
          signUp: this.state.signUpRequestPending,
          addPlace: this.state.addPlaceRequestPending,
          addCity: this.state.addCityRequestPending,
          editPlace: this.state.editPlaceRequestPending,
          editCity: this.state.editCityRequestPending,
          uploadImage: this.state.uploadImageRequestPending,
          deletePlace: this.state.deletePlaceRequestPending,
          deleteCity: this.state.deleteCityRequestPending,
          deleteImage: this.state.deleteImageRequestPending,
        }}
        error={this.state.error}
        setError={this.setError}
      />)
  }

  render = () => {
    if (this.state.ready) {
      return (
        <React.Fragment>
          <Router>
            <Switch>
              <Route path="/password_reset" render={(props) => this.renderPasswordReset(props)}></Route>
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
            color={ICE_BLUE}
            loading={true}
            css={`margin: auto; background-color: #000000; top: ${(window.innerHeight - 500) / 2.5}px`}
            size={500}
          />
          <p style={{
            position: 'absolute',
            left: 0,
            right: 0,
            color: ICE_BLUE,
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
