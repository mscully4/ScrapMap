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
import PlacesAutocomplete from './PlacesAutocomplete';
import ImageUploader from './ImageUploader';

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
      this.toggle();
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
        {/* <svg
          style={styles.addIcon}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          onClick={this.toggleAdd}
        >
          <path
            d="M512 16C240 16 16 240 16 512s224 496 496 496 496-224 496-496S784 16 512 16z m0 960C256 976 48 768 48 512S256 48 512 48 976 256 976 512 768 976 512 976z"
            fill="#737373"
          />
          <path
            d="M736 480h-192V288c0-19.2-12.8-32-32-32s-32 12.8-32 32v192H288c-19.2 0-32 12.8-32 32s12.8 32 32 32h192v192c0 19.2 12.8 32 32 32s32-12.8 32-32v-192h192c19.2 0 32-12.8 32-32s-12.8-32-32-32z"
            fill="#737373"
          />
        </svg> */}

        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader toggle={this.toggle}>Add City</ModalHeader>
            <ModalBody>
              <Form ref={ref => this.formAddCity = ref} onSubmit={e => this.props.handleAddCity(e, this.state)} autoComplete={"new-password"}>
                <PlacesAutocomplete
                  name="city"
                  placeholder="city"
                  value={this.state.city}
                  selectAutoSuggest={this.selectAutoSuggest}
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
                <ImageUploader
                  onChange={this.handleImageChange}
                />
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
