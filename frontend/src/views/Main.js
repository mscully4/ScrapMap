import React from 'react';
import Map from '../components/Map';
import Table from '../components/Table'
import ImageViewer from '../components/ImageViewer';

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
  constructor(props) {
    super(props)
    this.state = {
      galleryOpen: false,
      imageViewerOpen: false,
    }
  }

  toggleGallery = () => {
    this.setState(prevState => ({
      galleryOpen: !prevState.galleryOpen
    }))
  }

  tableRowClick = (obj) => {
    const images = obj.rowData.images.map(img => {
      img.src = this.props.backendURL + img.src;
      return img;
    })
  
    this.setState({
      galleryOpen: true,
      images: images
    })
  }

  toggleImageViewerOpen = () => {
    this.setState(prevState => ({
      imageViewerOpen: !prevState.imageViewerOpen
    }))
  }

  render() {
    return (
      <div style={style.main}>

        <Map 
        width={ this.props.width } 
        height={ this.props.height } 
        cities={ this.props.cities }
        logged_in={ this.props.loggedIn }
        handleEditCity={this.props.handleEditCity}
        handleDeleteCity={this.props.handleDeleteCity}
        handleImageOverwrite={this.props.handleImageOverwrite}
        backendURL={this.props.backendURL}
        hoverIndex={this.props.hoverIndex}
        changeHoverIndex={this.props.changeHoverIndex}
        />

        <Table 
        cities={this.props.cities}
        backendURL={this.props.backendURL}
        hoverIndex={this.props.hoverIndex}
        changeHoverIndex={this.props.changeHoverIndex}
        tableRowClick={this.tableRowClick}
        />

        <Modal className={"Poopy"} isOpen={this.state.galleryOpen} toggle={this.toggleGallery} size={"xl"}>
          <Gallery photos={this.state.images} />
        </Modal>

        {/* <ImageViewer 
            isOpen={this.state.imageViewerOpen} 
            setImageViewerOpen={this.setImageViewerOpen}
            images={ this.props.data.images }
            currImg={ this.state.currImg }
            changeCurrImg={ this.changeCurrImg }
            setCurrImg={ this.setCurrImg }
            backdropClosable={true}
            handleImageOverwrite={this.props.handleImageOverwrite}
            
          /> */}

      </div>
    ) 
  }
}

export default Main;