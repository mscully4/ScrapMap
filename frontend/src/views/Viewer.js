import React from 'react';
import Gallery from "react-photo-gallery";
import { Modal } from 'reactstrap';
import clsx from 'clsx'
import { withStyles} from '@material-ui/styles';
import Carousel, { ModalGateway } from 'react-images';


import Map from '../components/Map';
import Table from '../components/Table'
import { closePath } from "../utils/SVGs"
import ImageViewer from '../components/ImageViewer';
import Navigation from '../components/NavBar'
import { Add1, Add2 } from '../utils/SVGs';
import { getUser } from '../utils/fetchUtils';



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

class Viewer extends React.Component {
  static defaultProps = {
    cities: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      //General
      selectedCity: null,
      hoverIndex: null,
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
      //addForm
      addFormOpen: false
    }
  }

  componentDidMount = () => {
    console.log("Viewer")
    // console.log(this.props.u)
    // getUser(localStorage.getItem("token"), this.props.u).then(obj => {
    //   console.log(obj)
    // })
  }

  //General Functions
  setSelectedCity = (obj) => {
    this.setState({
      selectedCity: obj
    })
  }

  changeHoverIndex = (index) => {
    this.setState({
      hoverIndex: index,
    })

    //console.log(index, this.props.cities[index])

    // if (index !== null) {
    //   this.setState({
    //     mapCenter: {
    //       lat: this.props.cities[index].latitude,
    //       lng: this.props.cities[index].longitude
    //     }
    //   })
    // }
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
      galleryOpen: obj.event.target.getAttribute("value") !== "KILL",
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

  toggleAddForm = () => {
    this.setState(prevState => ({
      addFormOpen: !prevState.addFormOpen
    }));
  }

  render() {
    return (
      <React.Fragment>
        <Navigation 
          loggedIn={this.props.loggedIn} 
          username={this.props.username} 
          handleLogout={this.props.handleLogout} 
          toggleLogin={this.props.toggleLogin}
          toggleSignUp={this.props.toggleSignUp}
          handleLogin={this.props.handleLogin}
          handleSignup={this.props.handleSignup}
          username={this.props.username}
          />
        <p>Granularity: {this.state.granularity}</p>

        <div className={clsx(this.props.classes.main)}>
          <Map 
          center={this.state.mapCenter} 
          zoom={this.state.mapZoom}
          cities={ this.props.cities }
          logged_in={ this.props.loggedIn }
          //handleEditCity={this.props.handleEditCity}
          //handleDeleteCity={this.props.handleDeleteCity}
          //backendURL={this.props.backendURL}
          hoverIndex={this.state.hoverIndex}
          changeHoverIndex={this.changeHoverIndex}
          setCurrImg={this.setCurrImg}
          toggleImageViewerOpen={this.toggleImageViewerOpen}
          markerClick={this.markerClick}
          changeGranularity={this.changeGranularity}
          />

          <Table 
          cities={this.props.cities}
          backendURL={this.props.backendURL}
          hoverIndex={this.state.hoverIndex}
          changeHoverIndex={this.changeHoverIndex}
          changeMapCenter={this.changeMapCenter}
          tableRowClick={this.tableRowClick}
          toggleEditForm={this.toggleEditForm}
          handleDeleteCity={this.props.handleDeleteCity}
          toggleUploader={this.toggleUploader}
          />

          <Modal isOpen={this.state.galleryOpen} toggle={this.toggleGallery} size={"xl"}>
            <Gallery 
            photos={this.state.selectedCity ? this.prepareImageURLS(this.state.selectedCity) : null} 
            onClick={this.galleryOnClick}
            />
          </Modal>


          <ImageViewer 
          backendURL={this.props.backendURL}
          isOpen={this.state.imageViewerOpen} 
          toggleViewer={this.toggleViewer}
          views={this.props.cities.length ? this.props.cities[0].images : [{src: ""}]}
          currentIndex={ this.state.currImg }
          //changeCurrImg={ this.changeCurrImg }
          //setCurrImg={ this.setCurrImg }
          //backdropClosable={true}
          handleImageOverwrite={this.props.handleImageOverwrite}
          toggleEditor={this.toggleEditor}
          showLoader={this.showLoader}
          />


        </div>
      </React.Fragment>
    ) 
  }
}

export default withStyles(styles)(Viewer);