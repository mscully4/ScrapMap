import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles'
import { Button } from 'reactstrap'
import RingLoader from "react-spinners/RingLoader";
import LinearProgress from '@material-ui/core/LinearProgress';

import { close, Svg } from '../../utils/SVGs'
import MyDropzone from './Dropzone';
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2 } from '../../utils/colors'

const styles = theme => ({
  imageUploaderPopUp: {
    position: 'fixed',
    bottom: 25,
    right: 25,
    height: 500,
    width: 500,
    backgroundColor: OFF_BLACK_1,
    boxShadow: "0 10px 10px 5px #777",
    border: "2px solid #777"
  },
  imageUploaderHeader: {
    backgroundColor: OFF_BLACK_2,
    height: 50,
  },
  imageUploaderHeaderClose: {
    width: 25,
    fill: FONT_GREY,
    margin: 'auto',
    cursor: 'pointer',
    right: 10,
    position: "absolute",
    top: 12.5,
    fontSize: 20
  },
  imageUploaderTitle: {
    color: ICE_BLUE,
    textAlign: 'left',
    top: "40%",
    lineHeight: '50px',
    marginLeft: "10px",
    fontSize: 24
  },
  imagesSelected: {
    textAlign: "center",
    marginTop: 15
  },
  button: {
    width: '80%',
    margin: 'auto',
    position: 'absolute',
    bottom: '5%',
    left: '10%',
    backgroundColor: ICE_BLUE
  },
  dropzone: {
    top: '20%',
    height: "300px",
    marginTop: "25px !important"
  },
  progressBar: {
    width: '80%',
    position: 'absolute !important',
    left: '10%',
    bottom: '7.5%',
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: ICE_BLUE
    }
  },
  uploadingText: {
    textAlign: 'center',
    left: '20%',
    display: 'block',
    bottom: '10%',
    position: 'absolute',
    width: '60%',
    fontSize: '24px',
    color: ICE_BLUE
  }
})

class ImageUploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      pictureNames: [],
      progress: 0
    };
  }

  onDrop = (obj) => {
    this.setState({
      pictureNames: this.state.pictureNames.concat([obj.name]),
      pictures: this.state.pictures.concat([obj])
    })
  }

  onCloseClick = (e) => {
    this.props.toggle(null)
  }

  uploadProgress = (progressEvent) => {
    let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
    this.setState({
      progress: percentCompleted
    })
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={clsx(this.props.classes.imageUploaderPopUp)}>
        <div className={clsx(this.props.classes.imageUploaderHeader)}>
          <p className={clsx(this.props.classes.imageUploaderTitle)}>Image Uploader</p>
          <Svg viewBox={close.viewBox} className={clsx(this.props.classes.imageUploaderHeaderClose)} onClick={this.props.submitImageLoading ? null : this.onCloseClick}>
            {close.path.map((el, i) => <path key={i} d={el} />)}
          </Svg>
        </div>
        {this.props.requestPending ?
          <div>
            <RingLoader
              size={200}
              color={ICE_BLUE}
              loading={true}
              css={"margin: auto; top: 100px; "}
            />
            <span className={classes.uploadingText}>Uploading...</span>
            <LinearProgress 
              className={classes.progressBar} 
              variant="determinate" 
              value={this.state.progress} 
            />
          </div>
          :
          <div className={clsx(classes.imageUploaderDiv)}>
            <MyDropzone onDrop={this.onDrop} className={clsx(classes.dropzone)} />
            <p className={clsx(classes.imagesSelected)}>{`Images Selected: ${this.state.pictures.length}`}</p>
            <Button className={classes.button} disabled={this.props.requestPending || this.state.pictures.length === 0} onClick={
              (e) => {
                this.props.handleImageSubmit(e, this.state, this.uploadProgress);
                this.setState({
                  pictures: [],
                  pictureNames: []
                })
              }}
            >
              Submit
          </Button>
          </div>
        }
      </div>

    );
  }
}

ImageUploader.propTypes = {
  toggle: PropTypes.func,
  requestPending: PropTypes.bool,
  handleImageSubmit: PropTypes.func, 

}

export default withStyles(styles)(ImageUploader);