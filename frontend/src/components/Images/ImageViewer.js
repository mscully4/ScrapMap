import React, { Component } from 'react';
import Carousel, { Modal, ModalGateway, NavigationPrev } from 'react-images';
// import { ImgEditor} from '../components/ImageEditor';
import { close, editorPath, trash, Svg } from '../../utils/SVGs'
import { ICE_BLUE } from '../../utils/colors'

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
    fill: ICE_BLUE,
    height: 32,
    width: 32,
  },
  trashSVG: {
    cursor: 'pointer',
    position: "absolute",
    right: 50,
    fill: ICE_BLUE,
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

  trashOnClick = (e, currentView) => {
    this.props.handleDeleteImage(e, currentView);
    this.props.toggleViewer(false)
    this.props.toggleGallery(true)
  }

  CustomHeader = (props) => {
    return (
      <div style={theme.headerDiv}>
        {props.isModal ?
          <span>
            <Svg style={theme.closeSVG} viewbox={close.viewBox} onClick={() => this.props.toggleViewer(false)}>
              {close.path.map((el, i) => <path key={`${i}`} d={el} />)}
            </Svg>
            {this.props.owner ?
              <Svg style={theme.trashSVG} viewbox={trash.viewBox} onClick={(e) => this.trashOnClick(e, props.currentView)}>
                {trash.path.map((el, i) => <path key={`${i}`} d={el} />)}
              </Svg> : null}
          </span> : null}
      </div>
    )
  }

  render() {
    return (
      <ModalGateway>
        {this.props.isOpen ?
          <Modal isOpen={true} onClose={() => this.props.toggleViewer(false)}>
            <Carousel views={this.props.views} currentIndex={this.props.currentIndex} components={{ Header: this.CustomHeader }} />
          </Modal>
          : null}
      </ModalGateway>
    )
  }
}