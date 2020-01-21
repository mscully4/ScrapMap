import React from 'react';
import ReactImageUploader from 'react-images-upload';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles'

const styles = theme => ({
  component: {
  },
  labelDiv: {
    textAlign:'center'
  },
  label: {
  }
})

//TODO this still needs some work, might have to make some changes to the node package
//Fix error message not disappearing, limit number of preview thumbnails
//vertically center the component if there are no thumbnails

class ImageUploader extends React.Component {

	constructor(props) {
		super(props);
		 this.state = { pictures: [] };
		 this.onDrop = this.onDrop.bind(this);
	}

	onDrop(pictureFiles, pictureDataURLs) {
    console.log(pictureFiles, pictureDataURLs)
		this.setState({
            pictures: this.state.pictures.concat(pictureFiles),
        });
	}

render() {
  return (
    <ReactImageUploader
      className={clsx(this.props.classes.component)}
      withIcon={true}
      buttonText='Choose images'
      onChange={this.props.onChange}
      imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
      maxFileSize={5242880}
      withPreview={true}
      label={
        <div className={this.props.classes.labelDiv}>
          <span>Upload Your Images!</span><br />
          <span>Max File Size 5MB</span><br />
          <span>Supported Extensions: JPG, PNG, JPEG, GIF</span>
        </div>
      }
      fileTypeError={"Unsupported File Type"}
      />
    );
  }
}

export default withStyles(styles)(ImageUploader);