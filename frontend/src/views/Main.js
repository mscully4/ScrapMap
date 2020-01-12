import React from 'react';
import Map from '../components/Map';
import Table from '../components/Table'
import ImageViewer from '../components/ImageViewer';
import Carousel, { ModalGateway } from 'react-images';
import { ImgEditor} from '../components/ImageEditor';



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
      //Gallery
      galleryOpen: false,
      //ImageViewer
      imageViewerOpen: false,
      currImg: null,
      //Editor
      editorOpen: false,
      showLoader: false
    }
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

  tableRowClick = (obj) => {
    this.setState({
      galleryOpen: true,
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

  showLoader = (value) => {
    this.setState({
      showLoader: value
    })
  }

  render() {
    const images = [{src: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}];
    return (
      <div style={style.main}>

        <Map 
        width={ this.props.width } 
        height={ this.props.height } 
        cities={ this.props.cities }
        logged_in={ this.props.loggedIn }
        handleEditCity={this.props.handleEditCity}
        handleDeleteCity={this.props.handleDeleteCity}
        backendURL={this.props.backendURL}
        hoverIndex={this.props.hoverIndex}
        changeHoverIndex={this.props.changeHoverIndex}
        setCurrImg={this.setCurrImg}
        toggleImageViewerOpen={this.toggleImageViewerOpen}
        />

        <Table 
        cities={this.props.cities}
        backendURL={this.props.backendURL}
        hoverIndex={this.props.hoverIndex}
        changeHoverIndex={this.props.changeHoverIndex}
        tableRowClick={this.tableRowClick}
        //setSelectedCity
        />

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

      </div>
    ) 
  }
}

export default Main;