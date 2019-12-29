import React from 'react';
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'

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

    }
    const imageEditor = React.createRef();
  }

  render = () => {
    //should move this to constants at some point
    const baseURL = 'http://localhost:8000'
    const test = baseURL + this.props.urls;
    const url='http://localhost:8000/media/IMG_2457.JPEG'
    // if (test === url) {

      return (
        <ImageEditor
          includeUI={{
            loadImage: {
              path: url,
              name: 'SampleImage'
            },
            theme: myTheme,
            menu: ["crop", "flip", "rotate", "filter"],
            //menu: ["crop", "flip", "rotate", "draw", "shape"],
            //initMenu: 'crop',
            uiSize: {
              width: '100%',
              height: '700px'
            },
            menuBarPosition: 'bottom'
          }}
          cssMaxHeight={500}
          cssMaxWidth={700}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70
          }}
        usageStatistics={true}
      />)

    // }
    // return null
  }
};