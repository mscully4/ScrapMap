import React from 'react';
import Map from '../components/Map';
import Table from '../components/Table'
import ImageViewer from '../components/ImageViewer';
import Carousel, { ModalGateway } from 'react-images';
import { ImgEditor} from '../components/ImageEditor';
import EditCity from '../components/EditCity.js'




import Gallery from "react-photo-gallery";
import { Modal } from 'reactstrap';

const style = {
  main: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "2fr 1fr",
    width: '90%',
    margin: 'auto',
    border: "solid 1px red"
  }
}

class Main extends React.Component {
  static defaultProps = {
    cities: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      //General
      selectedCity: null,
      //Hover
      hoverIndex: null,
      //Map
      //TODO change these to be the location of the first city in the saved data
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
      //Editor
      editorOpen: false,
      showLoader: false,
      //EditForm
      editFormOpen: false
    }
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

  changeMapCenter = (obj) => {
    this.setState({
      mapCenter: {
        lat: obj.latitude,
        lng: obj.longitude
      }
    })
  }

  setSelectedCity = (obj) => {
    this.setState({
      selectedCity: obj
    })
  }

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
    this.setState({
      galleryOpen: obj.event.target.getAttribute("value") !== "DROPDOWN",
      //images: images,
      selectedCity: obj.rowData,
    })
  }

  toggleViewer = (value) => {
    const boolean = typeof(value)  === 'boolean' ? value : !this.state.editorOpen;
    this.setState({
      imageViewerOpen: boolean
    })
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

  render() {
    return (
      <div style={style.main}>
       
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
        />

        {/* <button onClick={() => {this.setState({mapCenter: {lat: 25, lng: 25}}, () => console.log(this.state))}}>Click Me</button> */}

        <Modal className={"Poopy"} isOpen={this.state.galleryOpen} toggle={this.toggleGallery} size={"xl"}>
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

      </div>
    ) 
  }
}

export default Main;