import React, { Component } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
//import ImgsViewer from './react-images-viewer/ImgsViewer'
//import { Modal } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { ImgEditor} from './ImageEditor';


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
    display: 'inline-block',
    fill: 'currentColor',
    height: 32,
    stroke: 'currentColor',
    strokeWidth: 0,
    width: 32,
  }
}

export default class ImageViewer extends Component {
  static defaultProps = {
    imgs: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      imgs: this.props.views.map((obj, i) => {
        return {
          src: "http://localhost:8000" + obj.src, 
          //num: i,
          //caption: "Have you boofed yet?",
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

    // toggleEditor = () => {
    //   const editorWillBeOpen = !this.state.editorIsOpen;
    //   this.setState({
    //     editorIsOpen: editorWillBeOpen,
    //   })
    //   this.props.setImageViewerOpen(!editorWillBeOpen)
    // }

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
    CustomHeader = ({ innerProps, isModal }) => {
      return (
      <div style={theme.headerDiv}>
        { isModal ?  
        <span>
          <button role="button" value="boof" style={theme.closeButton} onClick={() => this.props.toggleViewer(false)}>
            <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            viewBox="0 0 24 24"
            style={theme.closeSVG}
            >
              <path d={closePath} />
            </svg>
          </button> 
          { this.props.context === "Owner" ?
          <button role="button" style={theme.closeButton} onClick={() => {this.props.toggleViewer(false); this.props.toggleEditor(true)}}>
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7.11111in" height="7.11111in"
            viewBox="0 0 640 640"
            style={theme.closeSVG}>
              <path d={editorPath} />
            </svg>
          </button> : null }
        </span>: null}
      </div>
      )
    }


    render() {
      const views = this.props.views.map((obj) => {
        return {src: this.props.backendURL + obj.src}
      })
      return (
        <ModalGateway>
          { this.props.isOpen ? 
          <Modal onClose={() => this.props.toggleViewer(false)}>
            {views.length ? <Carousel views={views} currentIndex={this.props.currentIndex} components={{ Header: this.CustomHeader }}/>: <div></div>}
          </Modal>
          : null }
        </ModalGateway>
        )
          {/* <ImgsViewer 
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
              left: 0}}<div {...innerProps}>
        // your component internals
      </div> 
              value={"BOOF"} onClick={() => this.toggleEditor()}/>]}
          />
          <Modal isOpen={this.state.editorIsOpen} toggle={this.toggleEditor} size={"xl"}>
            <ImgEditor 
            img={this.state.imgs[this.props.currImg]}
            handleImageOverwrite={this.props.handleImageOverwrite}
            setImageViewerOpen={this.props.setImageViewerOpen}
            setImageEditorOpen={(isOpen) => {this.setState({editorIsOpen: isOpen})}}
            />
          </Modal> */}
    }
}

const closePath = "M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"
const editorPath = "M 175.38,225.88 C 187.88,230.50 200.38,243.25 204.63,255.62 207.50,263.87 207.50,279.88 204.63,288.12   200.25,300.75 187.00,314.00 174.38,318.38 165.62,321.50 150.12,321.38 141.62,318.25 128.50,313.38 116.63,301.50 111.75,288.38 110.13,283.87 109.38,278.75 109.38,271.12 109.38,261.37 109.75,259.75 114.13,251.00 121.00,237.00 131.12,228.50 146.25,224.12 153.38,222.00 167.50,222.87 175.38,225.88 Z M 155.62,248.12 C 155.00,248.38 152.88,248.87 151.00,249.25 146.62,250.25 139.25,256.62 136.62,261.75 134.12,266.62 134.12,277.12 136.62,282.00 142.88,294.12 157.25,299.00 168.88,293.00 175.50,289.62 182.50,278.87 182.50,271.88 182.50,264.88 175.50,254.12 168.88,250.75 165.38,249.00 157.62,247.50 155.62,248.12 Z M 549.88,133.75 C 554.00,133.75 556.38,135.88 580.88,160.37 580.88,160.37 607.50,187.00 607.50,187.00 607.50,187.00 607.50,192.50 607.50,192.50 607.50,192.50 607.50,198.12 607.50,198.12 607.50,198.12 526.25,279.38 526.25,279.38 526.25,279.38 445.12,360.62 445.12,360.62 445.12,360.62 444.75,429.75 444.75,429.75 444.75,429.75 444.38,499.00 444.38,499.00 444.38,499.00 440.25,502.62 440.25,502.62 440.25,502.62 436.25,506.25 436.25,506.25 436.25,506.25 238.00,506.25 238.00,506.25 238.00,506.25 39.75,506.25 39.75,506.25 39.75,506.25 36.12,502.62 36.12,502.62 36.12,502.62 32.50,499.00 32.50,499.00 32.50,499.00 32.50,332.12 32.50,332.12 32.50,332.12 32.50,165.25 32.50,165.25 32.50,165.25 35.75,161.37 35.75,161.37 35.75,161.37 39.00,157.50 39.00,157.50 39.00,157.50 238.00,157.50 238.00,157.50 238.00,157.50 437.00,157.50 437.00,157.50 437.00,157.50 439.88,160.12 439.88,160.12 441.38,161.50 443.12,164.12 443.88,165.88 444.50,167.50 445.00,183.12 445.00,200.37 445.00,200.37 445.00,231.88 445.00,231.88 445.00,231.88 492.25,184.87 492.25,184.87 518.12,159.00 540.75,136.88 542.50,135.75 544.12,134.62 547.50,133.75 549.88,133.75 Z M 549.12,165.00 C 548.62,165.00 541.75,171.37 534.00,179.12 534.00,179.12 520.00,193.12 520.00,193.12 520.00,193.12 534.12,207.25 534.12,207.25 534.12,207.25 548.12,221.25 548.12,221.25 548.12,221.25 562.75,206.50 562.75,206.50 562.75,206.50 577.50,191.88 577.50,191.88 577.50,191.88 563.88,178.38 563.88,178.38 556.38,171.00 549.75,165.00 549.12,165.00 Z M 418.75,182.50 C 418.75,182.50 238.12,182.50 238.12,182.50 238.12,182.50 57.50,182.50 57.50,182.50 57.50,182.50 57.50,303.38 57.50,303.38 57.50,303.38 57.50,424.38 57.50,424.38 57.50,424.38 93.50,388.38 93.50,388.38 132.50,349.38 133.75,348.50 142.00,352.87 144.00,354.00 154.62,363.88 165.62,374.88 165.62,374.88 185.62,395.00 185.62,395.00 185.62,395.00 250.00,330.75 250.00,330.75 318.25,262.62 317.50,263.38 325.62,266.88 327.62,267.75 338.12,277.25 348.75,288.00 359.38,298.75 368.63,307.50 369.38,307.50 370.00,307.50 381.50,296.25 394.75,282.62 394.75,282.62 418.75,257.75 418.75,257.75 418.75,257.75 418.75,220.12 418.75,220.12 418.75,220.12 418.75,182.50 418.75,182.50 Z M 536.25,233.12 C 536.25,233.12 522.12,219.00 522.12,219.00 522.12,219.00 508.12,205.00 508.12,205.00 508.12,205.00 434.38,278.75 434.38,278.75 434.38,278.75 360.62,352.50 360.62,352.50 360.62,352.50 374.75,366.50 374.75,366.50 374.75,366.50 388.75,380.62 388.75,380.62 388.75,380.62 462.50,306.88 462.50,306.88 462.50,306.88 536.25,233.12 536.25,233.12 Z M 335.25,310.88 C 335.25,310.88 320.62,296.25 320.62,296.25 320.62,296.25 255.88,361.00 255.88,361.00 255.88,361.00 191.25,425.62 191.25,425.62 191.25,425.62 185.62,425.62 185.62,425.62 180.00,425.62 180.00,425.62 158.12,403.75 158.12,403.75 136.25,381.88 136.25,381.88 136.25,381.88 96.88,421.25 96.88,421.25 96.88,421.25 57.50,460.62 57.50,460.62 57.50,460.62 57.50,470.88 57.50,470.88 57.50,470.88 57.50,481.25 57.50,481.25 57.50,481.25 238.12,481.25 238.12,481.25 238.12,481.25 418.75,481.25 418.75,481.25 418.75,481.25 418.75,434.12 418.75,434.12 418.75,434.12 418.75,386.88 418.75,386.88 418.75,386.88 409.00,396.62 409.00,396.62 409.00,396.62 399.25,406.38 399.25,406.38 399.25,406.38 356.88,424.38 356.88,424.38 333.63,434.38 313.25,442.50 311.62,442.50 304.88,442.50 298.75,436.50 298.75,430.00 298.75,428.75 306.88,408.62 316.88,385.50 334.75,343.88 335.12,343.12 342.50,335.62 346.62,331.50 350.00,327.50 350.00,326.88 350.00,326.12 343.38,319.00 335.25,310.88 Z M 362.75,378.38 C 362.75,378.38 351.88,367.62 351.88,367.62 351.88,367.62 344.12,385.88 344.12,385.88 339.75,396.00 336.50,404.38 336.75,404.75 337.12,405.12 372.38,390.50 373.38,389.50 373.50,389.38 368.75,384.38 362.75,378.38 Z"