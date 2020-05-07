import React from 'react';
import Gallery from "react-photo-gallery";
import { Modal } from 'reactstrap';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx'
import RingLoader from "react-spinners/RingLoader";


import Navigation from '../components/NavBar'
import Map from '../components/Map/Map.js';
import Table from '../components/Table/Table.js'
import ImageViewer from '../components/Images/ImageViewer';
// import { ImgEditor } from '../components/ImageEditor';
import EditCity from '../components/Forms/EditCity.js';
import EditPlace from '../components/Forms/EditPlace.js';
import AddCity from '../components/Forms/AddCity.js';
import AddPlace from '../components/Forms/AddPlace.js';
import ImageUploader from '../components/Images/ImageUploader.js';

import { add, Svg } from '../utils/SVGs';
import { place_colors, city_colors } from '../utils/colors';
import { getDistanceBetweenTwoPoints } from '../utils/Formulas.js';
import { 
  prepareImageURLs
} from "../utils/Formulas"

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
    gridTemplateColumns: "3fr 2fr",
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
    loggedInCities: [],

  }

  constructor(props) {
    super(props)
    console.log(this.props)
    this.state = {
      //General
      ready: false,
      selectedCity: null,
      selectedPlace: null,
      hoverIndexCity: null,
      hoverIndexPlace: null,
      //Map
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
      editCityRequestPending: false,
      editPlaceFormOpen: false,
      editPlaceRequestPending: false,

      //Add Forms
      addCityFormOpen: false,
      addPlaceFormOpen: false,
      addCityRequestPending: false,
      addPlaceRequestPending: false,
    }

    this.myRef = React.createRef();
  }

  componentDidMount = () => {
    this.props.preparedImagesSetter(this.setPreparedImages)
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

  setPreparedImages = (images) => {
    this.setState({
      preparedImages: images
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
        preparedImages: obj.images,
        galleryOpen: true,
      })
    }
  }

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
        preparedImages: obj.rowData.images,
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
      preparedImages: images,
      galleryOpen: true
    })
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
    this.props.handleEditPlace(e, formData)
  }


  //Image Editor Functions
  toggleEditor = (value) => {
    const boolean = typeof (value) === 'boolean' ? value : !this.state.editorOpen;
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
    if (context === "cities") {
      const cities = []
      this.props.viewCities.forEach(obj => {
        cities.push(obj.city)
      })
      return cities.length
    } else if (context === "countries") {
      const countries = []
      this.props.viewCities.forEach(obj => {
        if (!countries.includes(obj.countryCode.toLowerCase())) {
          countries.push(obj.countryCode.toLowerCase())
        }
      })
      return countries.length
    } else if (context === "places") {
      return this.props.viewPlaces.length
    }
  }

  render() {
    const isOwner = this.props.viewUser === this.props.loggedInUser || this.props.viewUser === undefined;
    if (true) {
      return (
        <div>
          <Navigation
            loggedIn={this.props.loggedIn}
            loggedInUser={this.props.loggedInUser}
            viewUser={this.props.viewUser}
            handleLogout={this.props.handleLogout}
            toggleLogin={this.props.toggleLogin}
            toggleSignUp={this.props.toggleSignUp}
            handleLogin={this.props.handleLogin}
            handleSignup={this.props.handleSignup}
            loadingUserData={this.props.loadingUserData}
            loadingSignUpRequest={this.props.loadingSignUpRequest}
            history={this.props.history}
          />


          {isOwner ?
            <Svg viewBox={add.viewBox} className={clsx(this.props.classes.addSVG)} onClick={this.state.granularity ? this.toggleAddCityForm : this.toggleAddPlaceForm}>
              {add.path.map((el, i) => <path key={`${i}`} d={el} />)}
            </Svg> : null
          }

          <div
            className={clsx(this.props.classes.page)}
          >
            {isOwner ?
              <p style={{
                fontSize: 24,
                marginRight: 20,
                marginTop: 80,
                float: "right",
                color: "#f8f8ff"
              }}>
                {`Add a New ${this.state.granularity ? "City" : "Place"} -->`}
              </p>
              :
              null
            }

            <div className={clsx(this.props.classes.factDiv)}>
              <span>{`${isOwner ? "You've" : this.props.viewUser[0].toUpperCase() + this.props.viewUser.substring(1) + " Has "} Visited: `}</span><br />
              <p className={clsx(this.props.classes.factLine)}>{`${this.calculateFacts('countries')} Countries`}</p>
              <p className={clsx(this.props.classes.factLine)}>{`${this.calculateFacts("cities")} Cities`}</p>
              <p className={clsx(this.props.classes.factLine)}>{`${this.calculateFacts("places")} Places`}</p>
            </div>

            <div className={clsx(this.props.classes.main)}>
              <Map
                center={this.state.mapCenter}
                zoom={this.state.mapZoom}
                cities={this.props.viewCities}
                places={this.props.viewPlaces}
                hoverIndex={this.state.granularity ? this.state.hoverIndexCity : this.state.hoverIndexPlace}
                changeHoverIndex={this.state.granularity ? this.changeHoverIndexCity : this.changeHoverIndexPlace}
                getClosestCity={this.getClosestCity}
                setClosestCity={this.setClosestCity}
                markerClick={this.onMarkerClick}
                granularity={this.state.granularity}
                changeMapCenter={this.changeMapCenter}
                changeGranularity={this.changeGranularity}
                place_colors={place_colors}
                city_colors={city_colors}
              />

              <Table
                context={this.props.context}
                cities={this.props.viewCities}
                places={this.props.viewPlaces}
                backendURL={this.props.backendURL}
                hoverIndex={this.state.granularity ? this.state.hoverIndexCity : this.state.hoverIndexPlace}
                // changeHoverIndexCity={this.changeHoverIndexCity}
                changeHoverIndex={this.state.granularity ? this.changeHoverIndexCity : this.changeHoverIndexPlace}
                tableRowClick={this.tableRowClick}
                toggleEditForm={this.state.granularity ? this.toggleEditCityForm : this.toggleEditPlaceForm}
                handleDeleteCity={this.props.handleDeleteCity}
                handleDeletePlace={this.props.handleDeletePlace}
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
              owner={this.props.owner}
              isOpen={this.state.imageViewerOpen}
              toggleViewer={this.toggleViewer}
              toggleGallery={this.toggleGallery}
              views={this.state.preparedImages}
              currentIndex={this.state.currImg}
              handleDeleteImage={this.props.handleDeleteImage}
              // toggleEditor={this.toggleEditor}
              // editorOpen={this.state.editorOpen}
              requestPending={this.props.pendingRequests.deleteImage}
            />

            {this.props.username === this.props.user && (this.state.editCityFormOpen || this.props.pendingRequests.editCity) ?
              <EditCity
                isOpen={this.state.editCityFormOpen || this.props.pendingRequests.editCity}
                toggle={this.toggleEditCityForm}
                handleEditCity={this.props.handleEditCity}
                data={this.state.selectedCity}
                requestPending={this.props.pendingRequests.editCity}
              /> : null}

            {this.state.editPlaceFormOpen & this.props.username === this.props.user ?
              <EditPlace
                isOpen={this.state.editPlaceFormOpen}
                toggle={this.toggleEditPlaceForm}
                handleEditPlace={this.props.handleEditPlace}
                data={this.state.selectedPlace}
                editPlaceRequestPending={this.state.editPlaceRequestPending}
              /> : null}

            {this.state.addCityFormOpen && this.state.granularity === 1 && this.props.username === this.props.user ?
              <AddCity
                isOpen={this.state.addCityFormOpen}
                toggle={this.toggleAddCityForm}
                handleAddCity={this.props.handleAddCity}
                addCityRequestPending={this.state.addCityRequestPending}
              /> : null}

            {this.state.addPlaceFormOpen && this.state.granularity === 0 && this.props.username === this.props.user ?
              <AddPlace
                isOpen={this.state.addPlaceFormOpen}
                toggle={this.toggleAddPlaceForm}
                handleAddPlace={this.props.handleAddPlace}
                mapCenter={this.props.mapCenter}
                cities={this.props.viewCities}
                default={this.state.closestCity}
                placeTypes={PLACE_TYPES}
                addPlaceRequestPending={this.state.addCityRequestPending}
              /> : null
            }

            {this.state.uploaderOpen && this.props.username === this.props.user ?
              <ImageUploader
                handleImageSubmit={this.handleImageSubmit}
                toggle={this.toggleUploader}
                requestPending={this.props.pendingRequests.editPlace}
              />
              : null
            }

          </div>
        </div>
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