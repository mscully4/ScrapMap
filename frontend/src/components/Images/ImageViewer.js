import React, { Component } from 'react';
import Carousel, { Modal, ModalGateway, NavigationPrev} from 'react-images';
// import { ImgEditor} from '../components/ImageEditor';
import {close, editorPath, trash, Svg} from '../../utils/SVGs'

const theme = {
  headerDiv: {
    alignItems: 'center',
    position: 'absolute',
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'flex-end',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingBottom: 20,
    linearGgradient: 'rgba(0, 0, 0, 0.33), rgba(0, 0, 0, 0)',
    zIndex: 9999,
 
  },
  closeButton: {
    color: 'rgba(255, 255, 255, 0.75)',
    display: 'inline-flex',
    padding: 0,
    outline: 0,
    border: 0,
    background: 0, 
    textAlign: 'right'
  },
  closeSVG: {
    cursor: 'pointer',
    position: 'absolute', 
    top: 10,
    right: 10,
    fill: '#d4dada',
    height: 32,
    width: 32,
  },
  trashSVG: {
    cursor: 'pointer', 
    position: "absolute",
    right: 50,
    fill: '#d4dada',
    height: 32,
    top: 10
  }
}

export default class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {

    } 
  }

  onClose = (e) => {
    this.props.setImageViewerOpen(false);
  }

  CustomHeader = (props) => {
    return (
    <div style={theme.headerDiv}>
      { props.isModal ?  
      <span>
        <Svg style={theme.closeSVG} viewbox={close.viewBox} onClick={() => this.props.toggleViewer(false)}>
          {close.path.map((el, i) => <path key={`${i}`} d={el}/>)}
        </Svg>
        { this.props.loggedIn ? 
        <Svg style={theme.trashSVG} viewbox={trash.viewBox} onClick={(e) => this.props.deleteDisabled ? null : this.props.handleDeleteImage(e, props.currentView)}>
          {trash.path.map((el, i) => <path key={`${i}`} d={el}/>)}
        </Svg> : null }

        {/* { this.props.context === "Owner" ?
        <button role="button" style={theme.closeButton} onClick={() => {this.props.toggleViewer(false); this.props.toggleEditor(true)}}>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          // width="7.11111in" height="7.11111in"
          viewBox="0 0 640 640"
          style={theme.closeSVG}>
            <path d={editorPath} />
          </svg>
        </button> : null } */}
      </span>: null}
    </div>
    )
  }

  render() {
    return (
      <ModalGateway>
        { this.props.isOpen ?
        <Modal isOpen={this.props.isOpen} onClose={() => this.props.toggleViewer(false)}>
          <Carousel views={this.props.views} currentIndex={this.props.currentIndex} components={{ Header: this.CustomHeader }}/>
        </Modal>
        : null }
      </ModalGateway>
    )
  }
}