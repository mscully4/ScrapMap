import React, { Component } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import PropTypes from 'prop-types';

// import { ImgEditor} from '../components/ImageEditor';
import { close, editorPath, trash, Svg } from '../../utils/SVGs'
import { ICE_BLUE, FONT_GREY } from '../../utils/colors'

const theme = {
  headerDiv: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    background: 'linear-gradient(rgba(0, 0, 0, 0.99), rgba(0, 0, 0, 0))',
    zIndex: 9999,
    height: 60

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

class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
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
    var currentIndex = this.props.currentIndex >= this.props.views.length ? 0 : this.props.currentIndex
    return (
      <ModalGateway>
        {this.props.isOpen ?
          <Modal isOpen={true} onClose={() => this.props.toggleViewer(false)}>
            <Carousel views={this.props.views} currentIndex={currentIndex} components={{ Header: this.CustomHeader }} />
          </Modal>
          : null}
      </ModalGateway>
    )
  }
}

ImageViewer.propTypes = {
  views: PropTypes.array,
  currentIndex: PropTypes.number,
  toggleViewer: PropTypes.func,
  handleDeleteImage: PropTypes.func,
  toggleViewer: PropTypes.func,
  toggleGallery: PropTypes.func,
  owner: PropTypes.bool,
  isOpen: PropTypes.bool,
  requestPending: PropTypes.bool
}

export default ImageViewer