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
import PlaceAutocomplete from './PlaceAutocomplete';
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
      return this.state.city !== "" &&
      this.state.country !== "" && 
      this.state.countryCode !== "" &&
      this.state.latitude !== null &&
      this.state.longitude !== null ? true : false;
    }

    render() {     
      //console.log(this.state) 
      //console.log(this.allFieldsValid())
      return (
        <React.Fragment>
          <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
            <ModalHeader toggle={this.toggle}>Add City</ModalHeader>
              <ModalBody>
                <Form ref={ref => this.formAddCity = ref} onSubmit={e => this.props.handleAddCity(e, this.state)} autoComplete={"new-password"}>
                  <PlaceAutocomplete
                    name="place"
                    placeholder="place"
                    value={this.state.city}
                    selectAutoSuggestCity={this.selectAutoSuggest}
                    context={"Place"}
                    mapCenter={this.props.mapCenter}
                    options={{
                      location: { lat: 20, lng: 20 },
                      radius: 50000
                    }}
                  />
                  <br />
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
