import React, {useCallback} from 'react';
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
import MyDropzone from './Dropzone';

const styles = {
  addIcon: {
    height: 40,
    width: 40,
    cursor: 'pointer',
  }
}

const AUTOCOMPLETE_RADIUS = 500000

class AddPlace extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        closestCity: this.props.default,

        modalAdd: false,
        
        name: "",
        address: "",
        city: "",
        county: null,
        state: null,
        country: "", 
        zip: "",
        latitude: null, 
        longitude: null,
        types: null,
        placeId: "",
        
        pictureNames: [],
        pictures: [],

        pictures: [],
        pictureNames: [],
      };
  }

  dropdownSelect = obj => {
    this.setState({
      closestCity: obj
    })
    this.clear()
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
      name: value
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
      name: "",
      address: "",
      city: "",
      county: null,
      state: "",
      country: "", 
      zip: "",
      latitude: "", 
      longitude: "",
      types: null,
      placeId: "",
      
      pictureNames: [],
      pictures: [],
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
    return (
      <React.Fragment>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader toggle={this.toggle}>Add Place</ModalHeader>
            <ModalBody>
              <Form ref={ref => this.formAddCity = ref} onSubmit={e => this.props.handleAddPlace(e, this.state)}>
                <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={options[this.props.default.index]}
                // isDisabled={isDisabled}
                // isLoading={isLoading}
                // isClearable={isClearable}
                // isRtl={isRtl}
                // isSearchable={isSearchable}
                options={options}
                onChange={this.dropdownSelect}
                />
                <br />
                <Autocomplete
                  name="place"
                  placeholder="place"
                  value={this.state.place}
                  selectAutoSuggestCity={this.selectAutoSuggest}
                  context={"Place"}
                  location={{lat: this.state.closestCity.latitude, lng: this.state.closestCity.longitude, radius: AUTOCOMPLETE_RADIUS}}
                  value={this.state.name}
                  handleAutoCompleteChange={this.handleAutoCompleteChange}
                  selectAutoSuggestPlace={this.selectAutoSuggest}
                  
                />
                <br />
                <Input
                  type="text"
                  name="address"
                  placeholder="Number"
                  value={this.state.address}
                  onChange={this.handleChange}
                  // disabled={this.state.disabled}
                  // autoComplete={"new-password"}
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
                {/* <br />
                <Input 
                  type="text"
                  name="county"
                  placeholder="County"
                  value={this.state.county}
                  onChange={this.handleChange}
                  //disabled={this.state.disabled}
                  //autoComplete={"new-password"}
                 /> */}
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
                  name="country"
                  placeholder="Country"
                  value={this.state.country}
                  onChange={this.handleChange}
                  //disabled={this.state.disabled}
                  //autoComplete={"new-password"}
                 />
                <br />
                <Input 
                  type="text"
                  name="zip"
                  placeholder="Zip Code"
                  value={this.state.zip}
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
                 <br />
                 <MyDropzone />
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
