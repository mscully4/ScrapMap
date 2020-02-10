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
import Select from 'react-select';

export const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];


const styles = {
  addIcon: {
    height: 40,
    width: 40,
    cursor: 'pointer',
  }
}

class AddPlace extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        closestCity: this.props.cities[this.props.default],

        modalAdd: false,
        city: "",
        country: "", 
        latitude: null, 
        longitude: null,
        pictures: [],
        pictureNames: [],
      };
  }

  dropdownSelect = obj => {
    this.setState({
      closestCity: obj
    }, () => console.log(this.state.closestCity))
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
      place: null,
      latitude: null,
      longitude: null,
      pictureNames: [],
      pictures: [],
      hover: false,
    })
  }

  allFieldsValid = () => {  
    return this.state.place !== "" &&
    this.state.latitude !== null &&
    this.state.longitude !== null
  }

  render() {     
    const options = this.props.cities.map((obj, i) => {
      return {
        index: i,
        value: obj.city,
        label: obj.city,
        pk: obj.pk,
        latitude: obj.latitude,
        longitude: obj.longitude,
      }})
      console.log(options[this.props.default])
    return (
      <React.Fragment>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader toggle={this.toggle}>Add Place</ModalHeader>
            <ModalBody>
              <Form ref={ref => this.formAddCity = ref} onSubmit={e => console.log(this.state)}>
                <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={options[this.props.default]}
                // isDisabled={isDisabled}
                // isLoading={isLoading}
                // isClearable={isClearable}
                // isRtl={isRtl}
                // isSearchable={isSearchable}
                name="color"
                options={options}
                onChange={this.dropdownSelect}
                />
                <br />
                <Autocomplete
                  name="place"
                  placeholder="place"
                  value={this.state.city}
                  selectAutoSuggestCity={this.selectAutoSuggest}
                  context={"Place"}
                  //mapCenter={this.props.mapCenter}
                  location={{lat: this.state.closestCity.latitude, lng: this.state.closestCity.longitude, radius: 50000}}
                  
                />
                <br />
                {/*} <Input
                   type="text"
                   name="latitude"
                   placeholder="Country Code"
                   value={this.state.countryCode}
                   onChange={this.handleChange}
                   // disabled={this.state.disabled}
                   // autoComplete={"new-password"}
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

export default AddPlace;
