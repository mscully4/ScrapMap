import React, { Component } from 'react';
import ImgsViewer from 'react-images-viewer';
import { Modal } from 'reactstrap'


const images = [
    { src: "http://localhost:8000/media/lauren-1004968283-1.jpg-wm_d9PW8Uh.jpg" },
    { src: "http://localhost:8000/media/TheMonaLisa_VXGbR39.jpg" }
]

export default class ImageViewer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false,
        currImg: 1,
        imgs: this.props.urls.map((e, i) => {
          return {
            src: "http://localhost:8000" + e, 
            num: i,
          }
        }),
      } 
    }

    toggleModal = () => {
      this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
    }

    onClose = (e) => {
      this.props.toggleImageViewer();
      this.setState({
        isOpen: false,
      });
    }

    gotoNext = (e) => {
      const { currImg } = this.props
      const { imgs } = this.state

      if (currImg === (imgs.length - 1)) return;
        
      this.props.setCurrImg(this.props.currImg + 1);
        
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    gotoPrev = (e) => {
      const { currImg } = this.props;

      if (this.props.currImg === 0) return;
        
      this.props.setCurrImg(this.props.currImg - 1);

      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      
    }

    
    render() {
      return (
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
              />
      )
    }
}

