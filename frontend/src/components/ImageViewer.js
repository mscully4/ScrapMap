import React, { Component } from 'react';
// import ImgsViewer from 'react-images-viewer';
import Viewer from 'react-viewer';
import { Modal } from 'reactstrap';

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

    
    render() {
      return (
            // <ImgsViewer 
            //     imgs={this.state.imgs}
            //     isOpen={ this.props.isOpen }
            //     currImg={ this.props.currImg }
            //     onClickPrev={this.gotoPrev}
            //     onClickNext={this.gotoNext}
            //     onClose={this.onClose}
            //     closeBtnTitle={"Close"}
            //     leftArrowTitle={"Previous"}
            //     rightArrowTitle={"Next"}
            //     onClickImg={this.gotoNext}
            //     backdropCloseable={true}
            //     showThumbnails={true}
            //     onClickThumbnail={(i) => { this.props.setCurrImg(i) }}
            //   />

            <Viewer
              visible={this.props.isOpen}
              onClose={this.onClose}
              images={this.state.imgs}
              disableMouseZoom={true}
              loop={false}
              onChange={() => console.log("BOOF")}
              noImgDetails={true}
            />
      )
    }
}

