import React from 'react';
import Map from '../components/Map';
import Table from '../components/Table'
import ImageViewer from '../components/ImageViewer';
import Carousel, { ModalGateway } from 'react-images';
import { ImgEditor} from '../components/ImageEditor';
import EditCity from '../components/EditCity.js';
import AddCity from '../components/AddCity.js';
import ImageUploader from '../components/ImageUploader.js';
import { withStyles} from '@material-ui/styles';
import clsx from 'clsx'




import Gallery from "react-photo-gallery";
import { Modal } from 'reactstrap';
import { putEditCity } from '../utils/fetchUtils';

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
  imageUploaderPopUp: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    height: 500,
    width: 500,
    backgroundColor: '#fff',
    // display: 'grid',
    // gridTemplateRows: '1fr 1fr 1fr',
    // gridTemplateColumns: '1fr',
  },
  // imageUploader: {
  //   height: '80%',
  //   width: '100%',
  //   border: "solid 1px black",
  //   "& .fileContainer": {
  //     boxShadow: "none",
  //   },
  //   "&& img": {
  //     width: "150px !important",
  //     height: "150px !important"
  //   },
  //   "&& p": {
  //     fontSize: '18px'
  //   },
  //   "&& button": {
  //     fontSize: 20
  //   }
  // }
})

class Main extends React.Component {
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
  changeGranularity = (granularity) => {
    this.setState({
      granularity: granularity
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
    console.log(boolean)
    this.setState({
      galleryOpen: boolean
    })
  }

  galleryOnClick = (event, obj) => {
    console.log(obj)
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
      uploaderOpen: !uploaderOpen ? true : pk !== this.state.uploaderPK ? true : false,
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

  toggleAddForm = () => {
    console.log(this.state.addFormOpen)
    this.setState(prevState => ({
      addFormOpen: !prevState.addFormOpen
    }));
  }

  render() {
    return (
      <React.Fragment>
  <p>Granularity: {this.state.granularity}</p>
        <svg
          className={clsx(this.props.classes.addSVG)}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          onClick={this.toggleAddForm}
        >
          <path
            d={Add1}
            fill="#737373"
          />
          <path
            d={Add2}
            fill="#737373"
          />
        </svg>
{/* TODO Make the svg a function so that props can be passed down on invokation */}
        {/* <svg
          className={clsx(this.props.classes.addSVG)}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          onClick={this.toggleUploader}
        >
          <path
            d={Add1}
            fill="#737373"
          />
          <path
            d={Add2}
            fill="#737373"
          />
        </svg> */}


        <div className={clsx(this.props.classes.main)}>
       
       <Map 
       center={this.state.mapCenter} 
       zoom={this.state.mapZoom}
       cities={ this.props.cities }
       logged_in={ this.props.loggedIn }
       handleEditCity={this.props.handleEditCity}
       handleDeleteCity={this.props.handleDeleteCity}
       backendURL={this.props.backendURL}
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

       {/* <button onClick={() => {this.setState({mapCenter: {lat: 25, lng: 25}}, () => console.log(this.state))}}>Click Me</button> */}

       <Modal isOpen={this.state.galleryOpen} toggle={this.toggleGallery} size={"xl"}>
         <Gallery 
         photos={this.state.selectedCity ? this.prepareImageURLS(this.state.selectedCity) : null} 
         onClick={this.galleryOnClick}
         />
       </Modal>

      {/* <Modal style={{backgroundColor: "white", height: window.innerHeight * .9}} contentClassName={clsx(this.props.classes.modalContent)} isOpen={this.state.uploaderOpen} toggle={this.toggleUploader} size={"xl"}>
        <ImageUploadeer />
      </Modal>  */}


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

         { this.state.editorOpen ?
         <ImgEditor 
         isOpen={this.state.editorOpen}
         toggleEditor={this.toggleEditor}
         //TODO implement default props here/use the load from url in the image editor
         image={this.state.selectedCity ? this.state.selectedCity.images[this.state.currImg] : null}
         backendURL={this.props.backendURL}
         handleImageOverwrite={this.props.handleImageOverwrite}
         /> : null}

         { this.state.editFormOpen ? 
         <EditCity
           isOpen={this.state.editFormOpen}
           toggle={this.toggleEditForm}
           handleEditCity={this.props.handleEditCity}
           data={this.state.selectedCity}
         /> : null }

         { this.state.addFormOpen ? 
         <AddCity
           isOpen={this.state.addFormOpen}
           toggle={this.toggleAddForm}
           handleAddCity={this.props.handleAddCity}
         /> : null }

        { this.state.uploaderOpen ?
        <div className={clsx(this.props.classes.imageUploaderPopUp)}>
          {/* <div></div> */}
          <ImageUploader 
          className={clsx(this.props.classes.imageUploader)} 
          handleImageSubmit={this.handleImageSubmit}
          />
         </div>
         : null
        }

     </div>
      </React.Fragment>
    ) 
  }
}

const Add1 ="M512 16C240 16 16 240 16 512s224 496 496 496 496-224 496-496S784 16 512 16z m0 960C256 976 48 768 48 512S256 48 512 48 976 256 976 512 768 976 512 976z"
const Add2 ="M736 480h-192V288c0-19.2-12.8-32-32-32s-32 12.8-32 32v192H288c-19.2 0-32 12.8-32 32s12.8 32 32 32h192v192c0 19.2 12.8 32 32 32s32-12.8 32-32v-192h192c19.2 0 32-12.8 32-32s-12.8-32-32-32z"

export default withStyles(styles)(Main);