import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles'
import { Button } from 'reactstrap'
import { close, Svg } from '../../utils/SVGs'
import MyDropzone from './Dropzone';
import RingLoader from "react-spinners/RingLoader";



const styles = theme => ({
  imageUploaderPopUp: {
    position: 'fixed',
    bottom: 25,
    right: 25,
    height: 500,
    width: 500,
    backgroundColor: '#1a1a1a',
    boxShadow: "0 10px 10px 5px #777",
    border: "2px solid #777"
  },
  imageUploaderHeader: {
    backgroundColor: '#232323',
    height: 50,
  },
  imageUploaderHeaderClose: {
    width: 25,
    fill: '#d4dada',
    margin: 'auto',
    cursor: 'pointer',
    right: 10,
    position: "absolute",
    top: 12.5
  },
  imageUploaderTitle: {
    color: "#0095d2",
    textAlign: 'left',
    top: "40%",
    lineHeight: '50px',
    marginLeft: "10px"
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
    backgroundColor: "#0095d2"
  },
  dropzone: {
    top: '20%',
    height: "300px",
    marginTop: "25px !important"
  },
})

class ImageUploader extends React.Component {

	constructor(props) {
		super(props);
		 this.state = { 
       pictures: [],
       pictureNames: [],
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

  render() {
    const classes = this.props.classes;
    return (
      <div className={clsx(this.props.classes.imageUploaderPopUp)}>
        <div className={clsx(this.props.classes.imageUploaderHeader)}>
          <p className={clsx(this.props.classes.imageUploaderTitle)}>Image Uploader</p>
          <Svg viewBox={close.viewBox} className={clsx(this.props.classes.imageUploaderHeaderClose)} onClick={this.props.submitImageLoading ? null : this.onCloseClick}>
            {close.path.map(el => <path d={el}/>)}
          </Svg>
        </div>
        { this.props.submitImageLoading ?
          <RingLoader
            size={200}
            color={"#0095d2"}
            loading={true}
            css={"margin: auto; top: 100px; "}
          /> :
          <div className={clsx(classes.imageUploaderDiv)}>
            <MyDropzone onDrop={this.onDrop} className={clsx(classes.dropzone)}/>
            <p className={clsx(classes.imagesSelected)}>{`Images Selected: ${this.state.pictures.length}`}</p>
            <Button color={"#0095d2"} className={classes.button} disabled={this.state.pictures.length === 0} onClick={
              (e) => {
                this.props.handleImageSubmit(e, this.state);
                this.setState({
                  pictures: [],
                  pictureNames: []
                })
                // this.props.toggle(null)
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

export default withStyles(styles)(ImageUploader);