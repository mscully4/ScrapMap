import React from 'react';
import Gallery from "react-photo-gallery";
import { Modal } from 'reactstrap';
import { withStyles} from '@material-ui/styles';
import clsx from 'clsx'

import Navigation from '../components/NavBar'
import Map from '../components/Map';
import Table from '../components/Table'
import ImageViewer from '../components/ImageViewer';
import { ImgEditor} from '../components/ImageEditor';
import EditCity from '../components/EditCity.js';
import AddCity from '../components/AddCity.js';
import AddPlace from '../components/AddPlace.js';

import ImageUploader from '../components/ImageUploader.js';

import { Add1, Add2 } from '../utils/SVGs';
import { getDistanceBetweenTwoPoints } from '../utils/Formulas.js';
import { getUser } from '../utils/fetchUtils.js';



const styles = theme => ({
  main: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "2fr 1fr",
    width: '90%',
    margin: 'auto',
    border: "solid 1px red"
  },
  modalContent: {
    border: 'none',
    height: '100%'
  },
  addSVG: {
    height: 100,
    width: 100
  },
})

class Owner extends React.Component {
  static defaultProps = {
    cities: [],
  }

  constructor(props) {
    super(props)
    console.log(this.props.loggedInCities)
    this.state = {
      //General
      ready: false,
      selectedCity: null,
      hoverIndexCity: null,
      hoverIndexPlace: null,
      closestCity: null,
      //View Info
      viewUser: this.props.viewUser,
      viewCities: Boolean(this.props.viewUser) === false || this.props.loggedInUser === this.props.viewUser ? this.props.loggedInCities : [],
      viewPlaces: Boolean(this.props.viewUser) === false || this.props.loggedInUser === this.props.viewUser ? this.props.loggedInPlaces : [],
      //Map
      //TODO change these to be the location of the first city in the saved data
      granularity: 0,
      mapCenter: {
        lat: 33.7490, 
        lng: -84.3880
      },
      mapZoom: 4,
      //Gallery
      galleryOpen: false,
      //ImageViewer
      imageViewerOpen: false,
      currImg: null,
      //ImageUploader
      uploaderOpen: false,
      uploaderPK: null,
      images : [],
      imageNames: [],
      //Editor
      editorOpen: false,
      showLoader: false,
      //EditForm
      editFormOpen: false,
      //addCityForm
      addCityFormOpen: false,
      //addPlaceForm
      addPlaceFormOpen: false
    }
  }

  componentDidMount = () => {
    console.log("Owner")
    if (Boolean(this.props.viewUser) === true && this.props.loggedInUser !== this.props.viewUser) {
      getUser(localStorage.getItem("token"), this.props.viewUser).then(data => {
        let places = [], index = 0
        for (var i=0; i<data.destinations.length; ++i) {
          for (var z=0; z<data.destinations[i].places.length; ++z) {
            var place = data.destinations[i].places[z];
            places.push({...place, index})
            ++index
          }
        }
        this.setState({
          viewCities: data.destinations.map((el, i) => { return {...el, index: i}}),
          viewPlaces: places,
          ready: true,

        })
      })
    } else {
      this.setState({
        ready: true,
      })
    }
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

  getClosestCity = (centerLat, centerLong) => {
    var lowest = 99999999, lowestIndex = null, distance

    if (this.state.viewCities.length > 0)
    this.state.viewCities.forEach((obj, i) => {
      distance = getDistanceBetweenTwoPoints(centerLat, centerLong, obj.latitude, obj.longitude);
      if (distance < lowest) {
        lowest = distance;
        lowestIndex = i
      }
    })

    this.setState({
      closestCity: lowestIndex
    })
  }

  //Gallery Functions
  toggleGallery = (value) => {
    const boolean = typeof(value) === 'boolean' ? value : !this.state.galleryOpen;
    this.setState({
      galleryOpen: boolean
    })
  }

  galleryOnClick = (event, obj) => {
    this.toggleGallery(false)
    this.setCurrImg(obj.photo.i)
    this.toggleViewer(true)
  }

  prepareImageURLS = (data) => {
    return data.images.map((obj, i) => {
      return {
        i: i,
        src: this.props.backendURL + obj.src, 
        width: obj.width, 
        height: obj.height}
      })
  }

  //Table Functions
  tableRowClick = (obj, e) => {
    //TODO change this to using state logic
    this.setState({
      //galleryOpen: obj.event.target.getAttribute("value") !== "KILL",
      mapZoom: obj.event.target.getAttribute("value") !== "KILL" ? 12 : this.state.mapZoom,
      //images: images,
      selectedCity: obj.rowData,
    })
  }

  markerClick = (obj) => {
    this.setState({
      selectedCity: obj,
      galleryOpen: true
    })
  }

  //Viewer Functions
  toggleViewer = (value) => {
    const boolean = typeof(value)  === 'boolean' ? value : !this.state.editorOpen;
    this.setState({
      imageViewerOpen: boolean
    })
  }

  //Uploader Functions
  toggleUploader = (pk) => {
    //If the uploader is already open, close it if the same city was clicked else change the PK to the new city if a new city was clicked
    //ELSEIf the uploader was closed, open it with the pk selected
    const uploaderOpen = this.state.uploaderOpen;
    this.setState({
      uploaderPK: !uploaderOpen ? pk : pk !== this.state.uploaderPK ? pk : null,
      uploaderOpen: !uploaderOpen ? true : pk !== this.state.uploaderPK && pk !== null ? true : false,
    })
  }


  handleImageSubmit= (e, data) => {
    const formData = {
      ...data, 
      ...this.state.selectedCity
    }
    console.log(formData, data)
    
    this.props.handleEditCity(e, formData)
  }

  setCurrImg = (index) => {
    this.setState({
      currImg: index,
    })
  }

  toggleEditor = (value) => {
    const boolean = typeof(value)  === 'boolean' ? value : !this.state.editorOpen;
    //console.log(value)
    this.setState({
      editorOpen: boolean
    })
  }

  //Map Functions
  setMapCenter = ( obj ) => {
    this.setState({mapCenter: obj})
  }

  //Loader Functions
  showLoader = (value) => {
    this.setState({
      showLoader: value
    })
  }

  toggleEditForm = (value) => {
    value = typeof(value) === 'boolean' ? value : !this.state.editFormOpen;
    //if the editor is about to open, hide the hover box
    //this.props.changeHoverIndex(null)
    this.setState(prevState => ({
      editFormOpen: value,
      //hover: false,
    }));
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
          
          { this.props.user === this.props.username && this.props.user !== null && this.props.username !== null ?
          <svg
            className={clsx(this.props.classes.addSVG)}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => { 
              if (this.state.granularity === 1) this.toggleAddCityForm();
              else this.toggleAddPlaceForm();
            }}
          >
            <path
              d={Add1}
              fill="#737373"
            />
            <path
              d={Add2}
              fill="#737373"
            />
          </svg> : null }

          <p>Granularity: {this.state.granularity} Zoom: {this.state.mapZoom} Selected City: {this.state.selectedCity ? this.state.selectedCity.city : ""}</p>


          <div className={clsx(this.props.classes.main)}>
            <Map 
            center={this.state.mapCenter} 
            zoom={this.state.mapZoom}
            cities={this.state.viewCities}
            places={this.state.viewPlaces}
            //handleEditCity={this.props.handleEditCity}
            //handleDeleteCity={this.props.handleDeleteCity}
            //backendURL={this.props.backendURL}
            hoverIndexCity={this.state.hoverIndexCity}
            changeHoverIndexCity={this.changeHoverIndexCity}
            hoverIndexPlace={this.state.hoverIndexPlace}
            changeHoverIndexPlace={this.changeHoverIndexPlace}

            //setCurrImg={this.setCurrImg}
            //toggleImageViewerOpen={this.toggleImageViewerOpen}
            getClosestCity={this.getClosestCity}
            markerClick={this.markerClick}
            granularity={this.state.granularity}
            changeGranularity={this.changeGranularity}
            />

            <Table 
            context={this.props.viewUser === this.props.loggedInUser ? "Owner" : "Viewer"}
            cities={this.state.viewCities}
            places={this.state.viewPlaces}
            backendURL={this.props.backendURL}
            hoverIndex={this.state.granularity ? this.state.hoverIndexCity : this.state.hoverIndexPlace}
            // changeHoverIndexCity={this.changeHoverIndexCity}
            hoverIndexPlace={this.state.hoverIndexPlace}
            changeHoverIndex={this.state.granularity ? this.changeHoverIndexCity : this.changeHoverIndexPlace}
            changeMapCenter={this.changeMapCenter}
            tableRowClick={this.tableRowClick}
            toggleEditForm={this.toggleEditForm}
            handleDeleteCity={this.props.handleDeleteCity}
            toggleUploader={this.toggleUploader}
            toggleGallery={this.toggleGallery}
            granularity={this.state.granularity}
            selectedCity={this.state.selectedCity}
            />

            <Modal isOpen={this.state.galleryOpen} toggle={this.toggleGallery} size={"xl"}>
              <Gallery 
              photos={this.state.selectedCity ? this.prepareImageURLS(this.state.selectedCity) : null} 
              onClick={this.galleryOnClick}
              />
            </Modal>

            <ImageViewer 
            context={"Owner"}
            backendURL={this.props.backendURL}
            isOpen={this.state.imageViewerOpen} 
            toggleViewer={this.toggleViewer}
            views={this.state.viewCities.length ? this.state.viewCities[0].images : [{src: ""}]}
            currentIndex={ this.state.currImg }
            //changeCurrImg={ this.changeCurrImg }
            //setCurrImg={ this.setCurrImg }
            //backdropClosable={true}
            handleImageOverwrite={this.props.handleImageOverwrite}
            toggleEditor={this.toggleEditor}
            showLoader={this.showLoader}
            />

            { this.state.editorOpen & this.props.username === this.props.user ?
            <ImgEditor 
            isOpen={this.state.editorOpen}
            toggleEditor={this.toggleEditor}
            //TODO implement default props here/use the load from url in the image editor
            image={this.state.selectedCity ? this.state.selectedCity.images[this.state.currImg] : null}
            backendURL={this.props.backendURL}
            handleImageOverwrite={this.props.handleImageOverwrite}
            /> : null}

            { this.state.editFormOpen  & this.props.username === this.props.user ? 
            <EditCity
            isOpen={this.state.editFormOpen}
            toggle={this.toggleEditForm}
            handleEditCity={this.props.handleEditCity}
            data={this.state.selectedCity}
            /> : null }

            { this.state.addCityFormOpen && this.state.granularity === 1 && this.props.username === this.props.user ?  
            <AddCity
            isOpen={this.state.addCityFormOpen}
            toggle={this.toggleAddCityForm}
            handleAddCity={this.props.handleAddCity}
            /> : null }

            { this.state.addPlaceFormOpen && this.state.granularity === 0 && this.props.username === this.props.user ? 
            <AddPlace
            isOpen={this.state.addPlaceFormOpen}
            toggle={this.toggleAddPlaceForm}
            handleAddPlace={this.props.handleAddPlace}
            mapCenter={this.state.mapCenter}
            cities={this.state.viewCities}
            default={this.state.closestCity}
            /> : null
            }

            { this.state.uploaderOpen && this.props.username === this.props.user ?
            <ImageUploader 
            handleImageSubmit={this.handleImageSubmit}
            toggle={this.toggleUploader}
            />
            : null
            }

          </div>
        </React.Fragment>
      ) 
    } else {
      return <div></div>
    }
  }
}

export default withStyles(styles)(Owner);