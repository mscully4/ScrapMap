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

class EditPlace extends React.Component {
  static defaultProps = {
  };

  constructor(props) {
    super(props);
    console.log(this.props.data)

    this.state = {
      //place: {city: "", country: "", countryCode: "", latitude: null, longitude: null, index: null, urls: []},
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

    // clear = () => {
    //   this.setState({
    //     city: "",
    //     country: "",
    //     latitude: null,
    //     longitude: null,
    //     pictureNames: [],
    //     pictures: [],
    //     hover: false,
    //   })
    // }

    submitForm = () => {
      ReactDOM.findDOMNode(this.formEditPlace).dispatchEvent(new Event("submit"))
      this.props.toggle();
    }

    // hasBeenChanged = () => {
    //   console.log(this.state, this.props)
    //   return (this.state.country !== this.props.data.country ||
    //     this.state.city !== this.props.data.city ||
    //     this.state.latitude !== this.props.data.latitude ||
    //     this.state.longitude !== this.props.data.longitude ||
    //     this.state.pictures.length > 0
        
    //     )
    // }

    render() {
      const buttonDisabled = false //!this.hasBeenChanged(); 
      return (
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader toggle={this.props.toggle}>Edit</ModalHeader>
          <ModalBody>
            <Form ref={ref => this.formEditPlace = ref} onSubmit={e => this.props.handleEditPlace(e, this.state)} >
              <Input
              type="text"
              name="name"
              placeholder="Name"
              value={this.state.name}
              onChange={this.handleChange}
              // disabled={this.state.disabled}
              // autoComplete={"new-password"}
              />
              <br/>
              <Input
              type="text"
              name="number"
              placeholder="Number"
              value={this.state.number}
              onChange={this.handleChange}
              // disabled={this.state.disabled}
              // autoComplete={"new-password"}
              />
              <br />
              <Input 
              type="text"
              name="street"
              placeholder="Street"
              value={this.state.street}
              onChange={this.handleChange}
              //disabled={this.state.disabled}
              //autoComplete={"new-password"}
              />
              <br />
              <Input 
              type="text"
              name="city"
              placeholder="City"
              value={this.state.city}
              onChange={this.handleChange}
              //disabled={this.state.disabled}
              //autoComplete={"new-password"}
              />
              <br />
              <Input 
              type="text"
              name="state"
              placeholder="State"
              value={this.state.state}
              onChange={this.handleChange}
              //disabled={this.state.disabled}
              //autoComplete={"new-password"}
              />
              <br />
              <Input 
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={this.state.latitude}
              onChange={this.handleChange}
              //disabled={this.state.disabled}
              //autoComplete={"new-password"}
              />
              <br />
              <Input 
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={this.state.longitude}
              onChange={this.handleChange}
              //disabled={this.state.disabled}
              //autoComplete={"new-password"}
              />
            </Form>
        </ModalBody>
        <ModalFooter>
          <Button disabled={buttonDisabled} onClick={this.submitForm}>Submit</Button>
        </ModalFooter>
      </Modal>
      )
    }
}

export default EditPlace;