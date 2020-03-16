import React from 'react';
import ReactImageUploader from 'react-images-upload';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles'
import { Button } from 'reactstrap'
import { closePath } from '../utils/SVGs'
import MyDropzone from './Dropzone';


const styles = theme => ({
  imageUploaderPopUp: {
    position: 'fixed',
    bottom: 25,
    right: 25,
    height: 500,
    width: 500,
    backgroundColor: '#fff',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '50px auto',
    boxShadow: "0 10px 10px 5px #777",
    border: "2px solid #777"
    // display: 'grid',
    // gridTemplateRows: '1fr 1fr 1fr',
    // gridTemplateColumns: '1fr',
  },
  imageUploaderHeader: {
    backgroundColor: '#262626',
  },
  imageUploaderHeaderClose: {
    height: '100%',
    width: 25,
    fill: '#ffffff',
    margin: 'auto',
    cursor: 'pointer',
    marginRight: 10,
    float: "right"
  },
  imageUploaderDiv: {
    display: 'grid',
    gridTemplateRows: '4fr 1fr',
    gridTemplateColumns: '1fr',
    height: '100%'
  },
  imageUploader: {
    height: '100%',
    width: '100%',
    border: "solid 1px black",

    "& .fileContainer": {
      boxShadow: "none",
    },
    "&& img": {
      width: "150px !important",
      height: "150px !important"
    },
    "&& p": {
      fontSize: '18px'
    },
    "&& button": {
      fontSize: 20
    }
  },
  button: {
    height: '60%',
    width: '80%',
    margin: 'auto',
  },

  labelDiv: {
    textAlign:'center'
  },
  label: {
  },
})

//TODO this still needs some work, might have to make some changes to the node package
//Fix error message not disappearing, limit number of preview thumbnails
//vertically center the component if there are no thumbnails

class ImageUploader extends React.Component {

	constructor(props) {
		super(props);
		 this.state = { 
       pictures: [],
       pictureNames: [],
      };
  }
  
  onChange = (files, URLs) => {
    let pictures = this.state.pictures;
    let pictureNames = this.state.pictureNames
    for (let i=0; i<files.length; ++i) {
      //TODO find a way to prevent duplicates from being added
      if (!pictureNames.includes(files[i].name)) {
         pictures.push(files[i])
         pictureNames.push(files[i].name)
      }
    }
    this.setState({
      pictures: pictures,
      pictureNames: pictureNames
    })
  }

  onDrop = (obj) => {
    console.log(obj)
  }

  onCloseClick = (e) => {
    this.props.toggle(null)
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={clsx(this.props.classes.imageUploaderPopUp)}>
        <div className={clsx(this.props.classes.imageUploaderHeader)}>
          <span>Image Uploader</span>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            viewBox="0 0 24 24"
            className={clsx(this.props.classes.imageUploaderHeaderClose)}
            onClick={this.onCloseClick}

            >
              <path d={closePath} />
            </svg>
        </div>
        <div className={clsx(classes.imageUploaderDiv)}>
          {/* <ReactImageUploader
          className={clsx(classes.imageUploader)}
          withIcon={true}
          buttonText='Choose images'
          onChange={this.onChange}
          imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
          maxFileSize={5242880 * 2}
          withPreview={false}
          label={
            <div className={this.props.classes.labelDiv}>
              <span>Upload Your Images!</span><br />
              <span>Max File Size 5MB</span><br />
              <span>Supported Extensions: JPG, PNG, JPEG, GIF</span><br />
              { this.state.pictures.length ? <span>{this.state.pictures.length}</span> : null}
            </div>
          }
          fileTypeError={"Unsupported File Type"}
          /> */}
          <MyDropzone onDrop={this.onDrop}/>
          <Button className={classes.button} onClick={(e) => this.props.handleImageSubmit(e, this.state)}>Submit</Button>
        </div>
      
      </div>
      
    );
  }
}

export default withStyles(styles)(ImageUploader);