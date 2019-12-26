import React from 'react';
import ReactImageUploader from 'react-images-upload';

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
                	withIcon={true}
                	buttonText='Choose images'
                	onChange={this.props.onChange}
                	imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
                  maxFileSize={5242880}
                  withPreview={true}
            />
        );
    }
}

export default ImageUploader;