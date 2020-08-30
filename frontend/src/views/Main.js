import React from 'react';
import Gallery from "react-photo-gallery";
import { Modal, ModalBody } from 'reactstrap';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx'
import RingLoader from "react-spinners/RingLoader";
import { PropTypes } from 'prop-types'

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
import Error from '../components/Error.js'
import { add, Svg, placeTypeSVGs } from '../utils/SVGs';
import { getUserDebounced } from '../utils/fetchUtils';
import { place_colors, city_colors, FONT_GREY, ICE_BLUE, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3 } from '../utils/colors';
import { getDistanceBetweenTwoPoints } from '../utils/Formulas.js';

const PLACE_TYPES = Object.keys(placeTypeSVGs)
const DEFAULT_CENTER = { lat: 33.7490, lng: -84.3880 }
const GRANULARITY_CUTOFF = 9

const styles = theme => ({
  page: {
    backgroundColor: OFF_BLACK_1,
    color: FONT_GREY,
  },
  main: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "3fr 2fr",
    width: '90%',
    margin: 'auto',
    paddingBottom: "200px"
  },
  modalContent: {
    border: 'none',
    height: '100%',
    backgroundColor: "transparent"
  },
  topBar: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 5fr auto 1fr",
    gridTemplateRows: '1fr',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30
  },
  addSVG: {
    height: 100,
    width: 100,
    fill: ICE_BLUE,
  },
  factDiv: {
    fontSize: 24,
    color: FONT_GREY,
  },
  factLine: {
    textIndent: 20,
    margin: 0,
    color: FONT_GREY
  },
  addSVGText: {
    fontSize: 24,
    marginRight: 20,
    color: FONT_GREY,
    textAlign: 'right',
  },
  modal: {
    backgroundColor: OFF_BLACK_1
  },
  modalBody: {
    backgroundColor: OFF_BLACK_2
  }
})

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,

      //General
      selectedCity: null,
      selectedPlace: null,
      hoverIndexCity: null,
      hoverIndexPlace: null,

      //view
      viewUser: "",
      viewCities: [],
      viewPlaces: [],

      //Map
      granularity: 1,
      mapZoom: 4,
      mapCenter: {
        lat: DEFAULT_CENTER.lat,
        lng: DEFAULT_CENTER.lng,
      },
      closestCity: null,

      //Gallery
      galleryOpen: false,
      preparedImages: [],

      //ImageViewer
      imageViewerOpen: false,
      currImg: null,

      //ImageUploader
      uploaderOpen: false,
      uploaderPK: null,

      //Editor
      // editorOpen: false,
      // showLoader: false,

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
  }

  componentDidMount = () => {
    this.props.setters.setPreparedImages(this.setPreparedImages)
    // this.props.setters.changeMapCenter(this.changeMapCenter)
    // this.props.setters.changeGranularity(this.changeGranularity)

    var viewUser, viewCities
    if (this.props.loggedInInfo.user === this.props.viewUser) {
      viewCities = this.props.loggedInInfo.userCities
      this.setState({
        viewUser: this.props.loggedInInfo.user,
        viewCities: viewCities,
        viewPlaces: this.props.compilePlaces(viewCities),
        ready: true
      })

      this.changeMapCenter({
        latitude: viewCities.length > 0 ? viewCities[0].latitude : DEFAULT_CENTER.lat,
        longitude: viewCities.length > 0 ? viewCities[0].longitude : DEFAULT_CENTER.lng
      })
      this.changeGranularity(4)
    }
    else {
      viewUser = this.props.viewUser;
      getUserDebounced(viewUser)
        //Overriding the default error handling behavior, if the user being searched for does not exists, show a pop-up
        .then(resp => {
          const response = resp.clone()
          if (response.status === 404) {
            console.log(response)
            if (!this.props.error.show) {
              this.props.setError({
                show: true,
                status: 404,
                statusText: "Not Found",
                message: `No User ${viewUser} Exists`
              })
            }
            throw Error`${response.status}: ${response.statusText}`
          }
          else if (!response.ok) {
            resp.json().then(err => {
              if (!this.props.error.show) {
                this.props.setError({
                  show: true,
                  status: response.status,
                  statusText: response.statusText,
                  message: err
                })
              }
            })
          }
          return response
        })
        .then(response => {
          response.json()
            .then(data => {
              viewCities = data.map((el, i) => {
                return {
                  ...el,
                  index: i,
                  color: city_colors[Math.floor(Math.random() * city_colors.length)]
                }
              })

              this.changeMapCenter({
                latitude: viewCities.length > 0 ? viewCities[0].latitude : DEFAULT_CENTER.lat,
                longitude: viewCities.length > 0 ? viewCities[0].longitude : DEFAULT_CENTER.lng
              })
              this.changeGranularity(4)

              this.setState({
                viewUser: viewUser,
                viewCities: viewCities,
                viewPlaces: this.props.compilePlaces(viewCities),
                ready: true
              })

            })
        })
        .catch(err => {
          if (this.props.error.show === false) {
            this.props.setError({
              show: true,
              status: "net",
              statusText: "ERR_CONNECTION_REFUSED",
              message: "Network Error"
            })
          }
        })
    }
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

  setClosestCity = (cities, centerLat, centerLong) => {
    var lowest = 99999999, lowestIndex = null, distance

    if (cities.length > 0)
      cities.forEach((obj, i) => {
        distance = getDistanceBetweenTwoPoints(centerLat, centerLong, obj.latitude, obj.longitude);
        if (distance < lowest) {
          lowest = distance;
          lowestIndex = i
        }
      })

    const closestCity = { ...cities[lowestIndex], distanceFromMapCenter: lowest }

    this.setState({
      closestCity: closestCity
    })

    return closestCity
  }

  //This is passed up to App.js
  setPreparedImages = (images) => {
    this.setState({
      preparedImages: images
    })
  }

  //Map Functions
  changeGranularity = (zoom) => {
    this.setState({
      granularity: zoom > GRANULARITY_CUTOFF ? 0 : 1,
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
      this.changeGranularity(GRANULARITY_CUTOFF + 1)
      this.changeHoverIndexCity(null)
      this.setState({
        selectedCity: obj,
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
      this.setState({
        selectedCity: obj.rowData,
        //The kill attribute make sure that an icon within the row isn't being clicked
        mapZoom: obj.event.target.getAttribute("value") !== "KILL" ? 12 : this.state.mapZoom,
        granularity: 1,
        hoverIndexCity: null
      })
    } else if (this.state.granularity === 0) {
      this.setState({
        selectedPlace: obj.rowData,
        preparedImages: obj.rowData.images,
        //The kill attribute make sure that an icon within the row isn't being clicked
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
    this.setState({
      galleryOpen: false,
      currImg: obj.photo.index,
      imageViewerOpen: true
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


  handleImageSubmit = (e, data, uploadProgress) => {
    const formData = {
      ...data,
      ...this.state.selectedPlace
    }
    this.props.handlers.uploadImage(e, formData, uploadProgress)
  }

  //Image Editor Functions
  // toggleEditor = (value) => {
  //   const boolean = typeof (value) === 'boolean' ? value : !this.state.editorOpen;
  //   this.setState({
  //     editorOpen: boolean
  //   })
  // }

  //Edit Form Functions
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

  //Add City Functions
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
    var viewCities = this.props.owner ? this.props.loggedInInfo.userCities : this.state.viewCities
    var viewPlaces = this.props.owner ? this.props.loggedInInfo.userPlaces : this.state.viewPlaces
    if (context === "cities") {
      const cities = []
      viewCities.forEach(obj => {
        cities.push(obj.city)
      })
      return cities.length
    } else if (context === "countries") {
      const countries = []
      viewCities.forEach(obj => {
        if (!countries.includes(obj.countryCode.toLowerCase())) {
          countries.push(obj.countryCode.toLowerCase())
        }
      })
      return countries.length
    } else if (context === "places") {
      return viewPlaces.length
    }
  }

  recenter = () => {
    var viewCities = this.props.owner ? this.props.loggedInInfo.userCities : this.state.viewCities
    const coords = {
      latitude: viewCities.length > 0 ? viewCities[0].latitude : DEFAULT_CENTER.lat,
      longitude: viewCities.length > 0 ? viewCities[0].longitude : DEFAULT_CENTER.lng
    }
    this.changeMapCenter(coords)
    this.changeGranularity(4)
  }


  render() {
    const classes = this.props.classes;
    var viewCities = this.props.owner ? this.props.loggedInInfo.userCities : this.state.viewCities
    var viewPlaces = this.props.owner ? this.props.loggedInInfo.userPlaces : this.state.viewPlaces
    if (this.state.ready) {
      return (
        <div>
          <Navigation
            loggedIn={this.props.loggedInInfo.loggedIn}
            loggedInUser={this.props.loggedInInfo.user}
            loggedInUserDataLoaded={this.props.loggedInInfo.userDataLoaded}
            handleLogout={this.props.handlers.logout}
            handleLogin={this.props.handlers.login}
            handleSignUp={this.props.handlers.signUp}
            pendingLoginRequest={this.props.pendingRequests.login}
            pendingSignUpRequest={this.props.pendingRequests.signUp}
            history={this.props.history}
            error={this.props.error}
            setError={this.props.setError}
            context={"Main"}
          />
          <div className={clsx(classes.page)}>
            <div className={clsx(classes.topBar)}>
              <div></div>
              <div className={clsx(classes.factDiv)}>
                <span>{`${this.props.owner ? "You've" : this.state.viewUser[0].toUpperCase() + this.state.viewUser.substring(1) + " Has "} Visited: `}</span><br />
                <p className={clsx(this.props.classes.factLine)}>{`${this.calculateFacts('countries')} Countries`}</p>
                <p className={clsx(this.props.classes.factLine)}>{`${this.calculateFacts("cities")} Cities`}</p>
                <p className={clsx(this.props.classes.factLine)}>{`${this.calculateFacts("places")} Places`}</p>
              </div>

              {this.props.owner ?
                <span className={classes.addSVGText}>
                  {`Add a New ${this.state.granularity ? "City" : "Place"} -->`}
                </span>
                :
                null
              }

              {this.props.owner ?
                <Svg viewBox={add.viewBox} className={clsx(this.props.classes.addSVG)} onClick={this.state.granularity ? this.toggleAddCityForm : this.toggleAddPlaceForm}>
                  {add.path.map((el, i) => <path key={`${i}`} d={el} />)}
                </Svg> : null
              }

              <div></div>
            </div>

            <div className={clsx(classes.main)}>
              <Map
                center={this.state.mapCenter}
                zoom={this.state.mapZoom}
                cities={viewCities}
                places={viewPlaces}
                hoverIndex={this.state.granularity ? this.state.hoverIndexCity : this.state.hoverIndexPlace}
                changeHoverIndex={this.state.granularity ? this.changeHoverIndexCity : this.changeHoverIndexPlace}
                setClosestCity={this.setClosestCity}
                markerClick={this.onMarkerClick}
                granularity={this.state.granularity}
                changeMapCenter={this.changeMapCenter}
                changeGranularity={this.changeGranularity}
              />

              <Table
                owner={this.props.owner}
                cities={viewCities}
                places={viewPlaces}
                backendURL={this.props.backendURL}
                hoverIndex={this.state.granularity ? this.state.hoverIndexCity : this.state.hoverIndexPlace}
                changeHoverIndex={this.state.granularity ? this.changeHoverIndexCity : this.changeHoverIndexPlace}
                tableRowClick={this.tableRowClick}
                toggleEditForm={this.state.granularity ? this.toggleEditCityForm : this.toggleEditPlaceForm}
                handleDeleteCity={this.props.handlers.deleteCity}
                handleDeletePlace={this.props.handlers.deletePlace}
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
              contentClassName={clsx(classes.modalContent)}
              onClick={() => {
                if (this.state.preparedImages.length === 0) {
                  this.toggleGallery(false)
                }
              }}
            >
              {/* Only Open Gallery if there are images to show.  If there is an error message, close the gallery */}
              {this.state.preparedImages.length > 0 && !this.props.showError ?
                <Gallery photos={this.state.preparedImages} onClick={this.galleryOnClick} /> :
                <div style={{
                  color: FONT_GREY,
                  fontSize: "80px",
                  paddingTop: "20%",
                  paddingBottom: "25%",
                  textAlign: "center",
                  backgroundColor: "rgba(40, 40, 40, .6)",
                  marginTop: "5%",
                  visibility: this.props.showError ? 'hidden' : 'visible'
                }}>No Images...</div>}
            </Modal>

            {this.state.imageViewerOpen && !this.props.pendingRequests.deleteImage ?
              <ImageViewer
                owner={this.props.owner}
                isOpen={true}
                toggleViewer={this.toggleViewer}
                toggleGallery={this.toggleGallery}
                views={this.state.preparedImages}
                currentIndex={this.state.currImg}
                handleDeleteImage={this.props.handlers.deleteImage}
                // toggleEditor={this.toggleEditor}
                // editorOpen={this.state.editorOpen}
                requestPending={this.props.pendingRequests.deleteImage}
              /> : null}
            {this.props.pendingRequests.deleteImage ?
              <Modal isOpen={true} className={classes.modal}>
                <ModalBody className={classes.modalBody}>
                  <RingLoader
                    color={ICE_BLUE}
                    loading={true}
                    css={`margin: auto`}
                    size={300}
                  />
                  <div style={{ textAlign: 'center', color: ICE_BLUE, marginTop: 25, fontSize: 28 }}>Deleting Image...</div>
                </ModalBody>
              </Modal> : null
            }

            {this.props.username === this.props.user && (this.state.editCityFormOpen || this.props.pendingRequests.editCity) ?
              <EditCity
                isOpen={this.state.editCityFormOpen || this.props.pendingRequests.editCity}
                toggle={this.toggleEditCityForm}
                handleEditCity={this.props.handlers.editCity}
                data={this.state.selectedCity}
                requestPending={this.props.pendingRequests.editCity}
              /> : null}

            {this.state.editPlaceFormOpen & this.props.username === this.props.user ?
              <EditPlace
                isOpen={this.state.editPlaceFormOpen}
                toggle={this.toggleEditPlaceForm}
                handleEditPlace={this.props.handlers.editPlace}
                data={this.state.selectedPlace}
                requestPending={this.props.pendingRequests.editPlace}
                placeTypes={PLACE_TYPES}
              /> : null}

            {this.state.addCityFormOpen && this.state.granularity === 1 && this.props.username === this.props.user ?
              <AddCity
                isOpen={this.state.addCityFormOpen}
                toggle={this.toggleAddCityForm}
                handleAddCity={this.props.handlers.addCity}
                requestPending={this.props.pendingRequests.addCity}
                setError={this.props.setError}

              /> : null}

            {this.state.addPlaceFormOpen && this.state.granularity === 0 && this.props.username === this.props.user ?
              <AddPlace
                isOpen={this.state.addPlaceFormOpen}
                toggle={this.toggleAddPlaceForm}
                handleAddPlace={this.props.handlers.addPlace}
                cities={viewCities}
                default={this.state.closestCity}
                placeTypes={PLACE_TYPES}
                requestPending={this.props.pendingRequests.addPlace}
                setError={this.props.setError}
              /> : null
            }

            {this.state.uploaderOpen && this.props.username === this.props.user ?
              <ImageUploader
                handleImageSubmit={this.handleImageSubmit}
                toggle={this.toggleUploader}
                requestPending={this.props.pendingRequests.uploadImage}
              />
              : null
            }

            {this.props.error.show ?
              <Error
                isOpen={true}
                error={this.props.error}
              /> : null}
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

Main.propTypes = {
  loggedInInfo: PropTypes.object,
  handlers: PropTypes.object,
  setters: PropTypes.object,
  pendingRequests: PropTypes.object,
  viewUser: PropTypes.string,
  error: PropTypes.object,
  setError: PropTypes.func,
  compilePlaces: PropTypes.func,
  owner: PropTypes.bool
}

export default withStyles(styles)(Main);