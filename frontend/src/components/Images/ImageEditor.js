import React from 'react';
import ReactDOM from 'react-dom'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import { Button, Modal } from 'reactstrap';


import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");


const myTheme = {
  "menu.backgroundColor": "white",
  "common.backgroundColor": "#fff",
  "downloadButton.backgroundColor": "white",
  "downloadButton.borderColor": "white",
  "downloadButton.color": "black",
  "menu.normalIcon.path": icond,
  "menu.activeIcon.path": iconb,
  "menu.disabledIcon.path": icona,
  "menu.hoverIcon.path": iconc,
};

export class ImgEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showLoader: false,
    }
    this.imageEditor = React.createRef();
    this.modalRef = React.createRef();
  }

  saveChanges = () => {
    this.setState({ showLoader: true })
    const editor = this.imageEditor.current.getInstance();
    this.props.handleImageOverwrite(this.props.image, editor.toDataURL())
    .then(res => {

      // if (res) {
      //   this.setState({showLoader: false})
      //   this.props.toggleEditor(false)
      //   this.props.toggleViewer(true)
      // } 
    })
  }

  componentDidMount = () => {
    setTimeout(function() {
      const headerButtons = document.getElementsByClassName("tui-image-editor-header-buttons")[0];
      while (headerButtons.children.length>0) {
        headerButtons.removeChild(headerButtons.children[0])
      }
    }, 100)

    //TODO Remove this if you feel like it
    // setTimeout(function() {
    //   const footerButtons = document.getElementsByClassName("tui-image-editor-menu")[0];
    //   footerButtons.removeChild(footerButtons.getElementsByClassName('tie-btn-delete'))
    // }, 100)
  }

  render = () => {
    console.log(this.props)
    return (
    // if (this.state.showLoader) {
    //   return (
    //     <div style={{height: "100%", width: "100%", backgroundColor: "white"}}>
    //       <Loader
    //       type="Puff"
    //       color="#00BFFF"
    //       height={80}
    //       width={80}
    //       />  
    //     </div>)
    // } else {
    //   return (
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggleEditor} size={"xl"} ref={(input) => {this.modalRef = input }}>
          <div>
          <Button onClick={this.saveChanges}>Save</Button>
          <ImageEditor
          ref={(input) => {this.imageEditor = input}}
          includeUI={{
            loadImage: {
              path: this.props.image.src,
              name: 'SampleImage'
            },
            theme: myTheme,
            menu: ["crop", "flip", "rotate", "filter"],
            //menu: ["crop", "flip", "rotate", "draw", "shape"],
            //initMenu: 'crop',
            uiSize: {
              width: '100%',
              height: '850px'
            },
            menuBarPosition: 'bottom'
          }}
          //cssMaxHeight={500}
          //cssMaxWidth={"100%"}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70
          }}
        usageStatistics={true}
        />
          </div>
        </Modal>
  )}
};