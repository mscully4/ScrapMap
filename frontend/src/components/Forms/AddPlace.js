import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import Autocomplete from './Autocomplete';
import Select from 'react-select';
import { Checkbox } from '@material-ui/core';
import RingLoader from "react-spinners/RingLoader";
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'


const styles = {
  addIcon: {
    height: 40,
    width: 40,
    cursor: 'pointer',
  },
  modal: {
    backgroundColor: "#000"
  },
  modalHeader: {
    backgroundColor: OFF_BLACK_2,
    color: ICE_BLUE,
    border: "none"
  },
  modalBody: {
    backgroundColor: OFF_BLACK_3
  },
  modalFooter: {
    backgroundColor: OFF_BLACK_2,
    border: "none"
  },
  inputStyle: {
    backgroundColor: OFF_BLACK_4,
    color: ICE_BLUE,
    borderColor: ICE_BLUE
  },
  fieldLabel: {
    color: ICE_BLUE,
    fontSize: 18,
    marginBottom: 0,
    marginTop: 10
  }
}

const reactSelectStyling = {
  menu: base => ({
    ...base,
    marginBottom: 76,
    color: ICE_BLUE,
    cursor: 'pointer',
    backgroundColor: OFF_BLACK_4,
    border: `solid 1px ${ICE_BLUE}`,
    marginTop: 0,
    borderTop: "none",
    borderRadius: 8
  }),
  selected: base => ({
    ...base,
    color: 'green'
  }),
  control: base => ({
    ...base,
    backgroundColor: OFF_BLACK_4,
    borderColor: ICE_BLUE, cursor: 'pointer'
    , '&:hover': { borderColor: ICE_BLUE }
  }),
  singleValue: base => ({
    ...base,
    color: ICE_BLUE
  }),
  indicatorSeparator: base => ({
    ...base,
    backgroundColor: ICE_BLUE
  }),
  dropdownIndicator: base => ({
    ...base,
    color: ICE_BLUE
  }),
  option: (base, state) => ({
    ...base, cursor: 'pointer',
    backgroundColor: state.isFocused ? ICE_BLUE : "inherit",
    color: state.isFocused ? "#000000" : ICE_BLUE
  })
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
      county: "",
      state: "",
      country: "",
      zip: "",
      latitude: null,
      longitude: null,
      main_type: null,
      types: null,
      main_type: "",
      placeId: "",

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
    const name = e.target.getAttribute("boof");
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
      ...obj,
      city: obj.city ? obj.city : this.props.default.city
    })
  }

  clear = () => {
    this.setState({
      name: "",
      address: "",
      city: "",
      county: "",
      state: "",
      country: "",
      zip: "",
      latitude: null,
      longitude: null,
      main_type: null,
      types: null,
      main_type: "",
      placeId: "",
    })
  }

  allFieldsValid = () => {
    return this.state.city !== "" &&
      this.state.name !== "" &&
      this.state.main_type !== "" &&
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

    return (
      <React.Fragment>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} style={styles.modal}>
          <ModalHeader toggle={this.toggle} style={styles.modalHeader}>Add Place</ModalHeader>
          <ModalBody style={styles.modalBody}>
            {!this.props.addPlaceRequestPending ?
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
                  // defaultMenuIsOpen={true}
                  styles={reactSelectStyling}
                />
                <br />
                <div style={{
                  display: "grid",
                  gridTemplateRows: "1fr",
                  gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr",
                  alignItems: 'center'
                }}>
                  <span style={{ textAlign: "center", color: ICE_BLUE }}>Search Radius</span>
                  <Input
                    type="text"
                    boof="searchRadius"
                    placeholder="Search Radius"
                    value={this.state.searchRadius}
                    onChange={this.handleChange}
                    style={styles.inputStyle}
                    autoComplete={"new-password"}

                  />
                  <span style={{ textAlign: "left", marginLeft: 10, color: ICE_BLUE }}>Miles</span>
                  <span style={{ textAlign: "right", color: ICE_BLUE }}>Strict Bounds?</span>
                  <Checkbox
                    checked={this.state.strictBounds}
                    onChange={this.handleChangeCheckbox}
                    name="strictBounds"
                    labelStyle={{ color: '#0095d2' }}
                    iconStyle={{ fill: '#0095d2' }}
                    inputStyle={{ color: '#0095d2' }}
                    style={{ color: '#0095d2' }}

                  />
                </div>
                <p style={styles.fieldLabel}>Name:</p>

                <Autocomplete
                  name="place"
                  placeholder="place"
                  value={this.state.place}
                  selectAutoSuggestCity={this.selectAutoSuggest}
                  context={"Place"}
                  location={{ lat: this.state.closestCity.latitude, lng: this.state.closestCity.longitude }}
                  value={this.state.name}
                  handleAutoCompleteChange={this.handleAutoCompleteChange}
                  selectAutoSuggestPlace={this.selectAutoSuggest}
                  strictBounds={this.state.strictBounds}
                  searchRadius={this.state.searchRadius * MILES_TO_METERS}
                  clearSuggestionsHook={this.clearSuggestionsHook}
                  changeMainType={this.changeMainType}
                  placeTypes={this.props.placeTypes}
                  inputStyle={styles.inputStyle}
                />
                <p style={styles.fieldLabel}>Type:</p>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  options={placeTypes}
                  styles={reactSelectStyling}
                  onChange={option => {
                    this.setState({
                      main_type: option.value
                    })
                  }}
                  value={placeTypes.find(el => el.value === this.state.main_type)}
                />
                <p style={styles.fieldLabel}>Address:</p>
                <Input
                  type="text"
                  boof="address"
                  placeholder="Address"
                  value={this.state.address}
                  onChange={this.handleChange}
                  style={styles.inputStyle}
                  autoComplete={"new-password"}
                />
                <p style={styles.fieldLabel}>City:</p>
                <Input
                  type="text"
                  boof="city"
                  placeholder="City"
                  value={this.state.city}
                  onChange={this.handleChange}
                  //disabled={this.state.disabled}
                  //autoComplete={"new-password"}
                  style={styles.inputStyle}
                  autoComplete={"new-password"}
                />
                <p style={styles.fieldLabel}>State:</p>

                <Input
                  type="text"
                  boof="state"
                  placeholder="State"
                  value={this.state.state}
                  onChange={this.handleChange}
                  style={styles.inputStyle}
                  autoComplete={"new-password"}
                />
                <p style={styles.fieldLabel}>Country:</p>

                <Input
                  type="text"
                  boof="country"
                  placeholder="Country"
                  value={this.state.country}
                  onChange={this.handleChange}
                  style={styles.inputStyle}
                  autoComplete={"new-password"}
                />
                <p style={styles.fieldLabel}>Zip Code:</p>

                <Input
                  type="text"
                  boof="zip"
                  placeholder="Zip Code"
                  value={this.state.zip}
                  onChange={this.handleChange}
                  style={styles.inputStyle}
                  autoComplete={"new-password"}
                />
                <p style={styles.fieldLabel}>Latitude:</p>

                <Input
                  type="text"
                  boof="latitude"
                  placeholder="Latitude"
                  value={this.state.latitude}
                  onChange={this.handleChange}
                  style={styles.inputStyle}
                  autoComplete={"new-password"}
                />
                <p style={styles.fieldLabel}>Longitude:</p>

                <Input
                  type="text"
                  boof="longitude"
                  placeholder="Longitude"
                  value={this.state.longitude}
                  onChange={this.handleChange}
                  style={styles.inputStyle}
                  autoComplete={"new-password"}
                />
                <br />
              </Form> :
              <RingLoader
                color={"#0095d2"}
                loading={true}
                css={`margin: auto`}
                size={200}
              />}
          </ModalBody>
          <ModalFooter style={styles.modalFooter}>
            <Button onClick={this.submitForm} disabled={!this.allFieldsValid()} style={{ backgroundColor: ICE_BLUE, width: "90%", margin: "auto" }}>Submit</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AddPlace;
