import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
    Button,
    Form,
    Input,
    InputGroup,
    Modal, 
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import ImageUploader from './ImageUploader';

class EditCity extends React.Component {
  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.data,
      disabled: false,  //TODO figure out a way to keep this true until a key is entered in city, maybe use an event listener
    };
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

  // handleImageChange = (files, URLs) => {
  //   let pictures = this.state.pictures;
  //   let pictureNames = this.state.pictureNames
  //   for (let i=0; i<files.length; ++i) {
  //     console.log(files[i])
  //     if (!pictureNames.includes(files[i].name)) {
  //       pictures.push(files[i])
  //       pictureNames.push(files[i].name)
  //     }
  //   }

  //   this.setState({
  //     data: {
  //       ...this.state.data,
  //       pictures: pictures
  //     },
  //     pictureNames: pictureNames,
  //   })
  // }

    clear = () => {
      this.setState({
        city: "",
        country: "",
        latitude: null,
        longitude: null,
      })
    }

    submitForm = () => {
      ReactDOM.findDOMNode(this.formEditCity).dispatchEvent(new Event("submit"))
      this.props.toggle();
    }

    hasBeenChanged = () => {
      console.log(this.state, this.props)
      return (
        this.state.country !== this.props.data.country ||
        this.state.city !== this.props.data.city ||
        this.state.latitude !== this.props.data.latitude ||
        this.state.longitude !== this.props.data.longitude ||
        this.state.pictures.length > 0
        )
    }

    render() {
      const buttonDisabled = !this.hasBeenChanged(); 
      return (
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Edit</ModalHeader>
        <ModalBody>
          <Form id="" ref={ref => this.formEditCity = ref} onSubmit={e => this.props.handleEditCity(e, this.state)} >
            <Input
              type="text"
              name="city"
              placeholder={this.props.data.city}
              value={this.state.city}
              onChange={this.handleChange}
            />
            <br />
            <Input
              type="text"
              name="country"
              placeholder={this.props.data.country}
              value={this.state.country}
              onChange={this.handleChange}
            />
            <br />
              <Input
              type="text"
              name="latitude"
              placeholder={this.props.data.latitude}
              value={this.state.latitude}
              onChange={this.handleChange}
            />
            <br />
              <Input
              type="text"
              name="longitude"
              placeholder={this.props.data.longitude}
              value={this.state.longitude}
              onChange={this.handleChange}
            />
            <br />
            {/* <ImageUploader
              onChange={this.handleImageChange}
            /> */}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button disabled={buttonDisabled} onClick={this.submitForm}>Submit</Button>
        </ModalFooter>
      </Modal>
      )
    }
}

export default EditCity;