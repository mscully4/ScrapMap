import React from 'react';
import Gallery from "react-photo-gallery";
import { Modal } from 'reactstrap';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx'
import RingLoader from "react-spinners/RingLoader";


import Navigation from '../components/NavBar'
import Map from '../components/Map';
import Table from '../components/Table'
import ImageViewer from '../components/ImageViewer';
import { ImgEditor } from '../components/ImageEditor';
import EditCity from '../components/EditCity.js';
import EditPlace from '../components/EditPlace.js';
import AddCity from '../components/AddCity.js';
import AddPlace from '../components/AddPlace.js';

import ImageUploader from '../components/ImageUploader.js';

import { add, Svg } from '../utils/SVGs';
import { place_colors, city_colors } from '../utils/colors';
import { getDistanceBetweenTwoPoints } from '../utils/Formulas.js';
import { fetchCurrentUser, fetchToken, putNewUser, postNewCity, putEditCity, deleteCity, deletePlace, deleteImage, getUser, postNewPlace, putEditPlace } from "../utils/fetchUtils"

const PLACE_TYPES = [
  "natural_feature",
  ['museum', 'art_gallery'],
  "zoo",
  "church",
  "casino",
  "stadium",
  "bar",
  ["food", "restaurant"],
  "amusement_park",
  "park",
  "store",
  ["embassy", "city_hall"],
  'airport',
  "university",
  "tourist_attraction",
  "establishment"
]

const DEFAULT_CENTER = { lat: 33.7490, lng: -84.3880 }
const FONT_GREY = "#f8f8ff"
const ICE_BLUE = "#0095d2"

const DOLLAR_BILL = "#006400"
const CHILI_PEPPER = "#9B1B30"
const GALAXY_BLUE = "#2A4B7C"
const BLUESTONE = "#577284"
const ORANGE_TIGER = "#f96714"
const EDEN = "#264e36"
const TUMERIC = "#FE840E"
const PINK_PEACOCK = "#C62168"
const ASPEN_GOLD = "#FFD662"
const TOFFEE = "#755139"
const SWEET_LILAC = "#E8B5CE"
const ULTRA_VIOLET = "#6B5B95"
const TRUE_RED = "#BC243C"
const BEER = "#f28e1c"
const NEBULAS_BLUE = "#3F69AA"
const LIMELIGHT = "#F1EA7F"
const NOTRE_DAME_GOLD = "##D39F10"
const MARBLE = "#fffcf0"
const ARCADIA = "#00A591"
const ISLAND_PARADISE = "#95DEE3"
const HAZELNUT = "#CFB095"

const colors = {
  font_grey: FONT_GREY,
  ice_blue: ICE_BLUE,
  natural_feature: EDEN,
  museum: ULTRA_VIOLET,
  zoo: ORANGE_TIGER,
  church: TRUE_RED,
  casino: DOLLAR_BILL,
  stadium: NEBULAS_BLUE,
  bar: BEER,
  food: CHILI_PEPPER,
  amusement_park: GALAXY_BLUE,
  park: SWEET_LILAC,
  store: PINK_PEACOCK,
  city_hall: MARBLE,
  airport: BLUESTONE,
  university: NOTRE_DAME_GOLD,
  tourist_attraction: TUMERIC,
  establishment: ARCADIA
}



const styles = theme => ({
  page: {
    backgroundColor: "#1a1a1a",
    color: FONT_GREY,
    // fontFamily: "serif"
  },
  main: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "2fr 1fr",
    width: '90%',
    margin: 'auto',
    // border: "solid 1px red",
    paddingBottom: "200px"
  },
  modalContent: {
    border: 'none',
    height: '100%',
    backgroundColor: "transparent"
  },
  addSVG: {
    height: 100,
    width: 100,
    fill: ICE_BLUE,
    float: 'right',
    margin: '50px 0',
    marginRight: 100
  },
  factDiv: {
    margin: "0px 100px",
    padding: "20px 0px",
    fontSize: 24,
    color: FONT_GREY
  },
  factLine: {
    textIndent: 20,
    margin: 0,
    color: FONT_GREY
  }
})

class Main extends React.Component {
  static defaultProps = {
    cities: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      //General
      ready: false,
      selectedCity: null,
      selectedPlace: null,
      hoverIndexCity: null,
      hoverIndexPlace: null,
      //View Info
      viewUser: this.props.viewUser,
      viewCities: Boolean(this.props.viewUser) === false || this.props.loggedInUser === this.props.viewUser ? this.props.loggedInCities : [],
      viewPlaces: Boolean(this.props.viewUser) === false || this.props.loggedInUser === this.props.viewUser ? this.props.loggedInPlaces : [],
      //Map
      //TODO handle the possibility of no cities
      granularity: 1,
      mapZoom: 4,
      mapCenter: {
        lat: this.props.loggedInCities.length > 0 ? this.props.loggedInCities[0].latitude : DEFAULT_CENTER.lat,
        lng: this.props.loggedInCities.length > 0 ? this.props.loggedInCities[0].longitude : DEFAULT_CENTER.lng,
      },
      closestCity: null,
      //Gallery
      galleryOpen: false,
      preparedImages: [],
      //ImageViewer
      imageViewerOpen: false,
      currImg: null,
      getCurrImg: null,
      deleteDisabled: null,
      //ImageUploader
      uploaderOpen: false,
      uploaderPK: null,
      images: [],
      imageNames: [],
      submitImageLoading: false,
      //Editor
      editorOpen: false,
      showLoader: false,
      //Edit Forms
      editCityFormOpen: false,
      editPlaceFormOpen: false,
      //Add Forms
      addCityFormOpen: false,
      addPlaceFormOpen: false
    }
  }

  componentDidMount = () => {
    //If there is a user selected in the url and if that user is not the user currently logged in
    if (Boolean(this.props.viewUser) === true && this.props.loggedInUser !== this.props.viewUser) {
      //load user info
      getUser(localStorage.getItem("token"), this.props.viewUser).then(data => {
        //update state with the data, and allow rendering of child components, change map center to first city
        const mapCenter = data.length > 0 ? { latitude: data[0].latitude, longitude: data[0].longitude } : DEFAULT_CENTER;
        const cities = data.map((el, i) => {
          return {
            ...el, 
            index: i,
            color: city_colors[Math.floor(Math.random() * city_colors.length)]
          }
        })
        this.changeMapCenter(mapCenter)
        this.setState({
          viewCities: cities,
          viewPlaces: this.props.compilePlaces(data),
          closestCity: this.getClosestCity(cities, mapCenter.lat, mapCenter.lng),
          ready: true,
        })
      })
    }
    //If no data needs to be loaded, allow rendering on children immediately 
    else {
      console.log(this.state.viewPlaces)
      this.setState({
        closestCity: this.getClosestCity(this.state.viewCities, this.state.mapCenter.lat, this.state.mapCenter.lng),
        ready: true
      })
    }
  }

  //Handlers
  handleAddCity = (e, data) => {
    e.preventDefault();
    if (this.props.loggedIn) {
      postNewCity(localStorage.getItem('token'), data)
        .then(res => {
          if (res) {
            this.setState({
              viewCities: this.state.viewCities.concat([{
                ...res, index: this.state.viewCities.length, color: city_colors[Math.floor(Math.random() * city_colors.length)]
              }]),
              mapZoom: 4,
              mapCenter: { lat: res.latitude, lng: res.longitude }
            })
          }
        })
    }
  }

  handleAddPlace = (e, data) => {
    e.preventDefault()
    console.log(data)
    const payload = {
      destination: data.closestCity.pk,
      name: data.name,
      address: data.address,
      city: data.closestCity.city,
      county: data.county,
      state: data.state,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      types: data.types,
      placeId: data.placeId,
      main_type: data.main_type
    }
    if (this.props.loggedIn) {
      postNewPlace(localStorage.getItem('token'), payload)
        .then(res => {
          console.log(res)
          // const place = {...res, index: this.state.viewPlaces.length};
          this.setState({
            viewPlaces: this.state.viewPlaces.concat([{ ...res, index: this.state.viewPlaces.length }]),
            viewCities: this.state.viewCities.map(obj => obj.pk === res.destination ? { ...obj, places: obj.places.concat([res]) } : obj)
          })
        })
    }
  }

  handleEditCity = (e, data) => {
    console.log(data)
    e.preventDefault();
    putEditCity(localStorage.getItem('token'), data)
      .then(json => {
        this.setState({
          viewCities: this.state.viewCities.map(el => el.pk === json.pk ? json : el),
          viewPlaces: this.props.compilePlaces(json)
        })
      })
  }

  handleEditPlace = (e, data) => {
    e.preventDefault();
    this.setState({
      submitImageLoading: true
    }, () => {
      putEditPlace(localStorage.getItem('token'), data)
        .then(json => {
          this.setState({
            viewCities: json.map((el, i) => { return { ...el, index: i } }),
            viewPlaces: this.props.compilePlaces(json),
            submitImageLoading: false
          }, () => this.toggleUploader(null))
        })
    })
  }

  handleDeleteCity = (e, data) => {
    e.preventDefault();
    deleteCity(localStorage.getItem('token'), data)
      .then(json => {
        console.log(json)
        this.setState({
          viewCities: json.map((el, i) => { return { ...el, index: i } }),
          viewPlaces: this.props.compilePlaces(json),
        })
      })
  }

  handleDeletePlace = (e, data) => {
    e.preventDefault();
    deletePlace(localStorage.getItem('token'), data)
      .then(json => {
        console.log(json)
        this.setState({
          viewCities: json.map((el, i) => { return { ...el, index: i } }),
          viewPlaces: this.props.compilePlaces(json)
        })
      })
  }

  handleDeleteImage = (e, data) => {
    e.preventDefault();
    this.setState({
      deleteDisabled: true,
    })

    deleteImage(localStorage.getItem('token'), data).then(json => {
      const city = json.find(obj => {
        return obj.pk === this.state.selectedPlace.destination
      })
      const place = city.places.find(obj => {
        return obj.pk === this.state.selectedPlace.pk
      })
      this.setState({
        viewCities: json.map((el, i) => { return { ...el, index: i } }),
        viewPlaces: this.props.compilePlaces(json),
        imageViewerOpen: false,
        galleryOpen: true,
        preparedImages: this.prepareImageURLs(place.images),
        deleteDisabled: false,
      })
    })
  }

  //General Functions
  setSelectedCity = (obj) => {
    this.setState({
      selectedCity: obj
    })
  }

  changeHoverIndexCity = (index) => {
    this.setState({
      hoverIndexCity: index,
    })
  }

  changeHoverIndexPlace = (index) => {
    this.setState({
      hoverIndexPlace: index
    })
  }

  getClosestCity = (cities, centerLat, centerLong) => {
    var lowest = 99999999, lowestIndex = null, distance

    if (cities.length > 0)
      cities.forEach((obj, i) => {
        distance = getDistanceBetweenTwoPoints(centerLat, centerLong, obj.latitude, obj.longitude);
        if (distance < lowest) {
          lowest = distance;
          lowestIndex = i
        }
      })

    return { ...cities[lowestIndex], distanceFromMapCenter: lowest }
  }

  setClosestCity = (city) => {
    this.setState({
      closestCity: city
    })
  }

  //Map Functions
  changeGranularity = (zoom) => {
    this.setState({
      granularity: zoom > 11 ? 0 : 1,
      mapZoom: zoom,
    })
  }

  changeMapCenter = (obj) => {
    this.setState({
      mapCenter: {
        lat: obj.latitude,
        lng: obj.longitude
      }
    })
  }

  //TODO on city marker click zoom into city, on place marker click show gallery
  onMarkerClick = (obj) => {
    if (this.state.granularity === 1) {
      this.changeMapCenter(obj)
      this.setState({
        selectedCity: obj,
        mapZoom: 12,
      })
    } else if (this.state.granularity === 0) {
      this.setState({
        selectedPlace: obj,
        preparedImages: this.prepareImageURLs(obj.images),
        galleryOpen: true,
      })
    }
  }
  // if (this.state.granularity === 1) {
  //   this.setState({
  //     // selectedCity: obj.rowData,
  //     // mapZoom: obj.event.target.getAttribute("value") !== "KILL" ? 12 : this.state.mapZoom,
  //     // granularity: 1,
  //     // hoverIndexCity: null
  //   }, () => console.log(this.state.mapZoom))
  // } else if (this.state.granularity === 0) {
  //   this.setState({
  //     // selectedPlace: obj.rowData,
  //     // galleryOpen: obj.event.target.getAttribute("value") !== "KILL" ? true : false,
  //   })
  // }

  //Table Functions
  tableRowClick = (obj, e) => {

    if (this.state.granularity === 1) {
      // this.changeMapCenter(obj.rowData)
      this.setState({
        selectedCity: obj.rowData,
        mapZoom: obj.event.target.getAttribute("value") !== "KILL" ? 12 : this.state.mapZoom,
        granularity: 1,
        hoverIndexCity: null
      })
    } else if (this.state.granularity === 0) {
      this.setState({
        selectedPlace: obj.rowData,
        preparedImages: this.prepareImageURLs(obj.rowData.images),
        galleryOpen: obj.event.target.getAttribute("value") !== "KILL" ? true : false,
      })
    }
  }

  cityGallery = (obj) => {
    const images = []
    obj.places.forEach((place) => {
      place.images.forEach((image) => {
        images.push(image)
      })
    })
    this.setState({
      preparedImages: this.prepareImageURLs(images),
      galleryOpen: true
    })
    // this.toggleGallery(true)
  }


  //Gallery Functions
  toggleGallery = (value) => {
    const boolean = typeof (value) === 'boolean' ? value : !this.state.galleryOpen;
    this.setState({
      galleryOpen: boolean
    })
  }

  galleryOnClick = (event, obj) => {
    this.toggleGallery(false)
    this.setCurrImg(obj.photo.i)
    this.toggleViewer(true)
  }

  prepareImageURLs = (data) => {
    return data.map((obj, i) => {
      return {
        pk: obj.pk,
        i: i,
        // src: this.props.backendURL + obj.src,
        src: obj.src,
        width: obj.width,
        height: obj.height,
        caption: "",
      }
    })
  }

  //Image Viewer Functions
  toggleViewer = (value) => {
    const boolean = typeof (value) === 'boolean' ? value : !this.state.editorOpen;
    this.setState({
      imageViewerOpen: boolean,
      galleryOpen: boolean ? false : true,
    })
  }

  setCurrImg = (index) => {
    this.setState({
      currImg: index
    })
  }

  getCurrentIndex = (func) => {
    this.getCurrImg = func
  }

  //Uploader Functions
  toggleUploader = (pk) => {
    //If the uploader is already open, close it if the same city was clicked.  If a new city is clicked, change the PK to the new city
    //ELSEIf the uploader was closed, open it with the pk selected
    const uploaderOpen = this.state.uploaderOpen;
    this.setState({
      uploaderPK: !uploaderOpen ? pk : pk !== this.state.uploaderPK ? pk : null,
      uploaderOpen: !uploaderOpen ? true : pk !== this.state.uploaderPK && pk !== null ? true : false,
    })
  }


  handleImageSubmit = (e, data) => {
    const formData = {
      ...data,
      ...this.state.selectedPlace
    }
    this.handleEditPlace(e, formData)
  }


  //Image Editor Functions
  toggleEditor = (value) => {
    const boolean = typeof (value) === 'boolean' ? value : !this.state.editorOpen;
    //console.log(value)
    this.setState({
      editorOpen: boolean
    })
  }

  //Loader Functions
  showLoader = (value) => {
    this.setState({
      showLoader: value
    })
  }

  //Edit Functions
  toggleEditCityForm = (value) => {
    value = typeof (value) === 'boolean' ? value : !this.state.editCityFormOpen;
    this.setState({
      editCityFormOpen: value,
    });
  }

  toggleEditPlaceForm = (value) => {
    value = typeof (value) === 'boolean' ? value : !this.state.editPlaceFormOpen;
    this.setState({
      editPlaceFormOpen: value
    })
  }

  //Add Functions
  toggleAddCityForm = () => {
    this.setState(prevState => ({
      addCityFormOpen: !prevState.addCityFormOpen
    }));
  }

  toggleAddPlaceForm = () => {
    this.setState(prevState => ({
      addPlaceFormOpen: !prevState.addPlaceFormOpen
    }))
  }

  calculateFacts = (context) => {
    if (context == "cities") {
      const cities = []
      this.state.viewCities.forEach(obj => {
        cities.push(obj.city)
      })
      return cities.length
    } else if (context == "countries") {
      const countries = []
      this.state.viewCities.forEach(obj => {
        if (!countries.includes(obj.countryCode.toLowerCase())) {
          countries.push(obj.countryCode.toLowerCase())
        }
      })
      return countries.length
    } else if (context == "places") {
      return this.state.viewPlaces.length
    }
  }

  render() {
    if (this.state.ready) {
      return (
        <React.Fragment>
          <Navigation
            loggedIn={this.props.loggedIn}
            username={this.props.loggedInUser}
            handleLogout={this.props.handleLogout}
            toggleLogin={this.props.toggleLogin}
            toggleSignUp={this.props.toggleSignUp}
            handleLogin={this.props.handleLogin}
            handleSignup={this.props.handleSignup}
          />
         

            {this.props.user === this.props.username && this.props.user !== null && this.props.username !== null ?
              <Svg viewBox={add.viewBox} className={clsx(this.props.classes.addSVG)} onClick={this.state.granularity ? this.toggleAddCityForm : this.toggleAddPlaceForm}>
                {add.path.map(el => <path d={el} />)}
              </Svg> : null
            }

          <div
            className={clsx(this.props.classes.page)}
          >
            <p style={{
              fontSize: 24,
              marginRight: 20,
              marginTop: 80,
              float: "right",
              color: "#f8f8ff"
            }}>
              {`Add a New ${this.state.granularity ? "City" : "Place"} -->`}
            </p>

            <div className={clsx(this.props.classes.factDiv)}>
              <span>You've Visited: </span><br />
              <p className={clsx(this.props.classes.factLine)}>{`${this.calculateFacts('countries')} Countries`}</p>
              <p className={clsx(this.props.classes.factLine)}>{`${this.calculateFacts("cities")} Cities`}</p>
              <p className={clsx(this.props.classes.factLine)}>{`${this.calculateFacts("places")} Places`}</p>
            </div>

            <div className={clsx(this.props.classes.main)}>
              <Map
                center={this.state.mapCenter}
                zoom={this.state.mapZoom}
                cities={this.state.viewCities}
                places={this.state.viewPlaces}
                //TODO These can be condensed into one each
                hoverIndexCity={this.state.hoverIndexCity}
                changeHoverIndexCity={this.changeHoverIndexCity}
                hoverIndexPlace={this.state.hoverIndexPlace}
                changeHoverIndexPlace={this.changeHoverIndexPlace}
                getClosestCity={this.getClosestCity}
                setClosestCity={this.setClosestCity}
                //TODO Need two marker click functions, one for place and one for city
                markerClick={this.onMarkerClick}
                granularity={this.state.granularity}
                changeMapCenter={this.changeMapCenter}
                changeGranularity={this.changeGranularity}
                place_colors={place_colors}
                city_colors={city_colors}
              />

              <Table
                context={this.props.context}
                cities={this.state.viewCities}
                places={this.state.viewPlaces}
                backendURL={this.props.backendURL}
                hoverIndex={this.state.granularity ? this.state.hoverIndexCity : this.state.hoverIndexPlace}
                // changeHoverIndexCity={this.changeHoverIndexCity}
                changeHoverIndex={this.state.granularity ? this.changeHoverIndexCity : this.changeHoverIndexPlace}
                tableRowClick={this.tableRowClick}
                toggleEditForm={this.state.granularity ? this.toggleEditCityForm : this.toggleEditPlaceForm}
                handleDeleteCity={this.handleDeleteCity}
                handleDeletePlace={this.handleDeletePlace}
                toggleUploader={this.toggleUploader}
                granularity={this.state.granularity}
                selectedCity={this.state.selectedCity}
                closestCity={this.state.closestCity}
                mapCenter={this.state.mapCenter}
                changeMapCenter={this.changeMapCenter}
                onCityGalleryClick={this.cityGallery}
                place_colors={place_colors}
                city_colors={city_colors}
              />

            </div>

            <Modal
              isOpen={this.state.galleryOpen}
              toggle={this.toggleGallery}
              size={"xl"}
              style={{ backgroundColor: "transparent" }}
              contentClassName={clsx(this.props.classes.modalContent)}
              onClick={() => {
                if (this.state.preparedImages.length === 0) {
                  this.toggleGallery(false)
                }
              }}
            >
              {this.state.preparedImages.length > 0 ?
                <Gallery
                  photos={this.state.preparedImages}
                  onClick={this.galleryOnClick}
                />
                :
                <div
                  style={{
                    color: FONT_GREY,
                    fontSize: "80px",
                    paddingTop: "20%",
                    paddingBottom: "25%",
                    textAlign: "center",
                    backgroundColor: "rgba(40, 40, 40, .6)",
                    // backgroundColor: 'rgba(0,149,210, .7)',
                    marginTop: "5%"
                  }}
                >No Images...</div>}
            </Modal>

            <ImageViewer
              // context={this.props.context}
              isOpen={this.state.imageViewerOpen}
              toggleViewer={this.toggleViewer}
              views={this.state.preparedImages}
              currentIndex={this.state.currImg}
              // getCurrentIndex={this.getCurrentIndex}
              // handleImageOverwrite={this.props.handleImageOverwrite}
              handleDeleteImage={this.handleDeleteImage}
              // toggleEditor={this.toggleEditor}
              // editorOpen={this.state.editorOpen}
              toggleEditor={this.toggleEditor}
              loggedIn={this.props.loggedIn}
              deleteDisabled={this.state.deleteDisabled}
            />

            {this.state.editCityFormOpen & this.props.username === this.props.user ?
              <EditCity
                isOpen={this.state.editCityFormOpen}
                toggle={this.toggleEditCityForm}
                handleEditCity={this.handleEditCity}
                data={this.state.selectedCity}
              /> : null}

            {this.state.editPlaceFormOpen & this.props.username === this.props.user ?
              <EditPlace
                isOpen={this.state.editPlaceFormOpen}
                toggle={this.toggleEditPlaceForm}
                handleEditPlace={this.handleEditPlace}
                data={this.state.selectedPlace}
              /> : null}

            {this.state.addCityFormOpen && this.state.granularity === 1 && this.props.username === this.props.user ?
              <AddCity
                isOpen={this.state.addCityFormOpen}
                toggle={this.toggleAddCityForm}
                handleAddCity={this.handleAddCity}
              /> : null}

            {this.state.addPlaceFormOpen && this.state.granularity === 0 && this.props.username === this.props.user ?
              <AddPlace
                isOpen={this.state.addPlaceFormOpen}
                toggle={this.toggleAddPlaceForm}
                handleAddPlace={this.handleAddPlace}
                mapCenter={this.props.mapCenter}
                cities={this.state.viewCities}
                default={this.state.closestCity}
                placeTypes={PLACE_TYPES}
              /> : null
            }

            {this.state.uploaderOpen && this.props.username === this.props.user ?
              <ImageUploader
                handleImageSubmit={this.handleImageSubmit}
                toggle={this.toggleUploader}
                submitImageLoading={this.state.submitImageLoading}
              />
              : null
            }

          </div>
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
            bottom: window.innerHeight * .1,
            opacity: .7
          }}>Loading...</p>
        </div>
      )
    }
  }
}

export default withStyles(styles)(Main);