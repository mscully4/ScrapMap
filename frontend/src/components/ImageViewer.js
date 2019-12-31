import React, { Component } from 'react';
import ImgsViewer from 'react-images-viewer';
//import ImgsViewer from './react-images-viewer/ImgsViewer'
import { Modal } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ImgEditor} from './ImageEditor';

export default class ImageViewer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        // isOpen: false,
        imgs: this.props.urls.map((e, i) => {
          return {
            src: "http://localhost:8000" + e, 
            num: i,
            caption: "Have you boofed yet?",
          }
        }),
        editorIsOpen: false,
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

    toggleEditor = () => {
      const editorWillBeOpen = !this.state.editorIsOpen;
      this.setState({
        editorIsOpen: editorWillBeOpen,
      })
      this.props.setImageViewerOpen(!editorWillBeOpen)
    }

    // handleImageModification = (e, i, mods) => {
    //   console.log(i)
    //   let imgs = [...this.state.imgs];
    //   imgs[i] = {
    //     ...this.state.imgs[i],
    //     modifications: {
    //       ...this.state.imgs[i].modifications,
    //       [mods.type]: (this.state.imgs[i].modifications[mods.type] ? this.state.imgs[i].modifications[mods.type] : 0) + mods.value
    //     }
    //   }
    //   this.setState({
    //     imgs: imgs
    //   }, () => console.log(this.state.imgs))
    // }
    
    render() {
      //console.log(window.innerWidth)
      return (
        <React.Fragment>
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
            customControls={[<FontAwesomeIcon icon={"edit"} style={{
              color: 'white', 
              width: '7.5%', 
              height: '100%', 
              left: 0}} 
              value={"BOOF"} onClick={() => this.toggleEditor()}/>]}
          />
          <Modal isOpen={this.state.editorIsOpen} toggle={this.toggleEditor} size={"xl"}>
            <ImgEditor 
            img={this.state.imgs[this.props.currImg]}
            handleImageOverwrite={this.props.handleImageOverwrite}
            
            />
          </Modal>
        </React.Fragment>
      )
    }
}

