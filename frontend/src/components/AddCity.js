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

import Autocomplete from './Autocomplete';

const styles = {
  addIcon: {
    height: 40,
    width: 40,
    cursor: 'pointer',
  }
}

class AddCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          modalAdd: false,
          city: "", 
          country: "", 
          countryCode: "",
          latitude: null, 
          longitude: null,
          pictures: [],
          pictureNames: [],
          disabled: false,  //figure out a way to keep this true until a key is entered in city, maybe use an event listener
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

    handleAutoCompleteChange = (value) => {
      this.setState({
        city: value
      })
    }

    handleImageChange = (files, URLs) => {
      let pictures = this.state.pictures;
      let pictureNames = this.state.pictureNames
      for (let i=0; i<files.length; ++i) {
        console.log(files[i])
        if (!pictureNames.includes(files[i].name)) {
          pictures.push(files[i])
          pictureNames.push(files[i].name)
        }
      }

      this.setState({
        data: {
          ...this.state.data,
          pictures: pictures
        },
        pictureNames: pictureNames,
      })
    }

    submitForm = () => {
      ReactDOM.findDOMNode(this.formAddCity).dispatchEvent(new Event("submit"))
      this.props.toggle();
    }

    selectAutoSuggest = (obj) => {
      this.setState({
        ...obj
      })
    }

    clear = () => {
      this.setState({
        city: "",
        country: "",
        latitude: null,
        longitude: null,
        countryCode: "",
        pictureNames: [],
        pictures: [],
        hover: false,
      })
    }

    allFieldsValid = () => {
      console.log(this.state.city,
      this.state.country, 
      this.state.countryCode,
      this.state.latitude,
      this.state.longitude)
      return this.state.city !== "" &&
      this.state.country !== "" && 
      this.state.countryCode !== "" &&
      this.state.latitude !== null &&
      this.state.longitude !== null ? true : false;
    }

    render() {     
      //console.log(this.state) 
      console.log(this.allFieldsValid())
      return (
        <React.Fragment>
          <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
            <ModalHeader toggle={this.toggle}>Add City</ModalHeader>
              <ModalBody>
                <Form ref={ref => this.formAddCity = ref} onSubmit={e => this.props.handleAddCity(e, this.state)} autoComplete={"new-password"}>
                  <Autocomplete
                    name="city"
                    placeholder="city"
                    value={this.state.city}
                    selectAutoSuggestCity={this.selectAutoSuggest}
                    context={"City"}
                    handleAutoCompleteChangeCity={this.handleAutoCompleteChange}
                    value={this.state.city}
                  />
                  <br />
                  <Input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={this.state.country}
                    onChange={this.handleChange}
                    disabled={this.state.disabled}
                    autoComplete={"new-password"}
                  />
                  <br />
                  <Input
                    type="text"
                    name="countryCode"
                    placeholder="Country Code"
                    value={this.state.countryCode}
                    onChange={this.handleChange}
                    disabled={this.state.disabled}
                    autoComplete={"new-password"}
                  />
                  <br />
                  <Input 
                    type="text"
                    name="latitude"
                    placeholder="Latitude"
                    value={this.state.latitude}
                    onChange={this.handleChange}
                    disabled={this.state.disabled}
                    autoComplete={"new-password"}
                  />
                  <br />
                  <Input
                    type="text"
                    name="longitude"
                    placeholder="Longitude"
                    value={this.state.longitude}
                    onChange={this.handleChange}
                    disabled={this.state.disabled}
                    autoComplete={"new-password"}
                  />
                  <br />
                  {/* <ImageUploader
                    onChange={this.handleImageChange}
                  /> */}
                </Form>
              </ModalBody>
            <ModalFooter>
              <Button onClick={this.submitForm}>Submit</Button>
            </ModalFooter>
          </Modal>
        </React.Fragment>
      )
    }
}

export default AddCity;
