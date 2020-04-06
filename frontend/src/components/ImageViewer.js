import React, { Component } from 'react';
import Carousel, { Modal, ModalGateway, NavigationPrev} from 'react-images';
// import { ImgEditor} from '../components/ImageEditor';
import {close, editorPath, trash, Svg} from '../utils/SVGs'
import { ThemeProvider } from '@material-ui/styles';

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
  static defaultProps = {
    imgs: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      // currentIndex: 0
    } 
  }

  componentDidMount = () => {
    // this.props.getCurrentIndex(this.getCurrentIndex)
  }

  onClose = (e) => {
    this.props.setImageViewerOpen(false);
  }

  // getCurrentIndex = () => {
  //   return this.state.currentIndex
  // }

  CustomHeader = (props) => {
    // console.log(this.state.currentIndex)
    // if (this.state.currentIndex != props.currentIndex) {
    //   this.setState({
    //     currentIndex: props.currentIndex
    //   })
    // }
    return (
    <div style={theme.headerDiv}>
      { props.isModal ?  
      <span>
        <Svg style={theme.closeSVG} viewbox={close.viewBox} onClick={() => this.props.toggleViewer(false)}>
          {close.path.map(el => <path d={el}/>)}
        </Svg>
        { this.state.loggedIn ? 
        <Svg style={theme.trashSVG} viewbox={trash.viewBox} onClick={(e) => this.props.handleDeleteImage(e, props.currentView)}>
          {trash.path.map(el => <path d={el}/>)}
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

  // customNavigationPrev = props => {
  //   // console.log(props)
  //   return (
  //   <svg
  //   role="presentation"
  //   className="CHORK"
  //   viewBox="0 0 24 24"
  //   style={{
  //     // display: 'inline-block',
  //     position: 'absolute',
  //     height: 50,
  //     width: 50,
  //     marginTop: -25,
  //     cursor: 'pointer',
  //     fill: 'red',
  //     stroke: 'red',
  //     strokeWidth: 1,
  //     top: '50%',
  //   }}
  //   {...props.innerProps}
  //   >
  //     <path d="M15.422 16.078l-1.406 1.406-6-6 6-6 1.406 1.406-4.594 4.594z" />
  //   </svg>
  //   )
  // }

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