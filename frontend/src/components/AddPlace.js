import React, { useCallback } from 'react';
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

const MILES_TO_METERS = 1609.34

class AddPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closestCity: this.props.default,

      modalAdd: false,

      strictBounds: true,
      searchRadius: 50,

      name: "",
      address: "",
      city: "",
      county: null,
      state: null,
      country: "",
      zip: "",
      latitude: null,
      longitude: null,
      main_type: null,
      types: null,
      placeId: "",

      pictureNames: [],
      pictures: [],

      pictures: [],
      pictureNames: [],
    };
    this.clearSuggestions = null

  }

  dropdownSelect = obj => {
    this.setState({
      closestCity: obj
    })
    this.clear()
  }

  handleChange = e => {
    this.clearSuggestions()
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

  handleChangeCheckbox = e => {
    this.clearSuggestions()
    this.setState({
      [e.target.name]: !this.state[e.target.name]
    })
  }

  handleAutoCompleteChange = (value) => {
    this.setState({
      name: value
    })
  }

  handleImageChange = (files, URLs) => {
    let pictures = this.state.pictures;
    let pictureNames = this.state.pictureNames
    for (let i = 0; i < files.length; ++i) {
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

  clearSuggestionsHook = (func) => {
    this.clearSuggestions = func
  }

  changeMainType = (type) => {
    this.setState({
      main_type: type
    })
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
      }
    })

    const placeTypes = []
    var counter = 0
    this.props.placeTypes.forEach((obj, i) => {
      if (typeof obj === 'string') {
        placeTypes.push({
          index: counter,
          value: obj,
          label: obj
        })
        counter++;
      } else if (typeof obj === 'object') {
        obj.forEach((el, x) => {
          placeTypes.push({
            index: counter,
            value: el,
            label: el
          })
          counter++;
        })
      }
    })

    console.log(placeTypes)
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
              <div style={{
                display: "grid",
                gridTemplateRows: "1fr",
                gridTemplateColumns: "2fr 1fr 2fr 1fr",
                alignItems: 'center'
              }}>
                <span style={{textAlign: "center"}}>Search Radius</span>
                <Input
                  type="text"
                  name="searchRadius"
                  placeholder="Search Radius"
                  value={this.state.searchRadius}
                  onChange={this.handleChange}
                />
                <span style={{textAlign: "center"}}>Strict Bounds?</span>
                <Input
                  name="strictBounds"
                  type={'checkbox'}
                  onChange={this.handleChangeCheckbox}
                  checked={this.state.strictBounds}
                  style={{
                    margin: "auto 0",
                    position: 'static',
                  }}
                />
              </div>
              <br />
              <Autocomplete
                name="place"
                placeholder="place"
                value={this.state.place}
                selectAutoSuggestCity={this.selectAutoSuggest}
                context={"Place"}
                location={{ lat: this.state.closestCity.latitude, lng: this.state.closestCity.longitude}}
                value={this.state.name}
                handleAutoCompleteChange={this.handleAutoCompleteChange}
                selectAutoSuggestPlace={this.selectAutoSuggest}
                strictBounds={this.state.strictBounds}
                searchRadius={this.state.searchRadius * MILES_TO_METERS}
                clearSuggestionsHook={this.clearSuggestionsHook}
                changeMainType={this.changeMainType}
                placeTypes={this.props.placeTypes}
              />
              <br />
              <Input
                type="text"
                name="address"
                placeholder="Address"
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
              <Select
                className="basic-single"
                classNamePrefix="select"
                // defaultValue={placeTypes[0]}
                // isDisabled={isDisabled}
                // isLoading={isLoading}
                // isClearable={isClearable}
                // isRtl={isRtl}
                // isSearchable={isSearchable}
                options={placeTypes}
                onChange={option => {
                  this.setState({
                  main_type: option.value
                })}}
                value={placeTypes.find(el => el.value === this.state.main_type)}
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
