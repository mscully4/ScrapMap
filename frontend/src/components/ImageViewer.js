import React, { Component } from 'react';
//import ImgsViewer from 'react-images-viewer';
 import ImgsViewer from './react-images-viewer/ImgsViewer'
//import Viewer from 'react-viewer';
import { Modal } from 'reactstrap';
import update from 'react-addons-update';

export default class ImageViewer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        // isOpen: false,
        currImg: 1,
        imgs: this.props.urls.map((e, i) => {
          return {
            src: "http://localhost:8000" + e, 
            num: i,
            caption: "Have you boofed yet?",
            modifications: {},
          }
        }),
      } 
    }


    onClose = (e) => {
      this.props.setImageViewerOpen(false);
    }

    gotoNext = (e) => {
      if (this.props.currImg === (this.state.imgs.length - 1)) return;
        
      this.props.setCurrImg(this.props.currImg + 1);
        
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    gotoPrev = (e) => {
      if (this.props.currImg === 0) return;
        
      this.props.setCurrImg(this.props.currImg - 1);

      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    handleImageModification = (e, i, mods) => {
      console.log(i)
      let imgs = [...this.state.imgs];
      imgs[i] = {
        ...this.state.imgs[i],
        modifications: {
          ...this.state.imgs[i].modifications,
          [mods.type]: (this.state.imgs[i].modifications[mods.type] ? this.state.imgs[i].modifications[mods.type] : 0) + mods.value
        }
      }
      this.setState({
        imgs: imgs
      }, () => console.log(this.state.imgs))
    }
    
    render() {
      //console.log(window.innerWidth)
      return (
            <ImgsViewer 
                imgs={this.state.imgs}
                isOpen={ this.props.isOpen }
                currImg={ this.props.currImg }
                onClickPrev={this.gotoPrev}
                onClickNext={this.gotoNext}
                onClose={this.onClose}
                closeBtnTitle={"Close"}
                leftArrowTitle={"Previous"}
                rightArrowTitle={"Next"}
                onClickImg={this.gotoNext}
                backdropCloseable={true}
                showThumbnails={true}
                onClickThumbnail={(i) => { this.props.setCurrImg(i) }}
                customControls={<div>Chork</div>}
                handleImageModification={this.handleImageModification}
              />

            // <Viewer
            //   visible={this.props.isOpen}
            //   onClose={this.onClose}
            //   images={this.state.imgs}
            //   disableMouseZoom={true}
            //   loop={false}
            //   onChange={() => console.log("BOOF")}
            //   noImgDetails={true}
            //   drag={false}
            // />
      )
    }
}

