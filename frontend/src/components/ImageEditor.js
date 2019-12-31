import React from 'react';
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import { Button } from 'reactstrap';

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
    this.imageEditor = React.createRef();
  }

  saveChanges = () => {
    const editor = this.imageEditor.current.getInstance();
    this.props.handleImageOverwrite(this.props.img, editor.toDataURL())
  }

  render = () => {
     if (this.props.img.src) {
      return (
        <div>
          <Button onClick={this.saveChanges}>Save</Button>
          <ImageEditor
          ref={this.imageEditor}
          includeUI={{
            loadImage: {
              path: this.props.img.src,
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
          //cssMaxHeight={500}
          //cssMaxWidth={"100%"}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70
          }}
        usageStatistics={true}
      />
        </div>
        )
    } else return <div></div>

      

    // }
    // return null
  }
};