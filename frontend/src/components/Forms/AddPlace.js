import React from 'react';
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
import clsx from 'clsx'
import Select from 'react-select';
import { Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/styles'

import Autocomplete from './Autocomplete';
import RingLoader from "react-spinners/RingLoader";
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'


const styles = theme => ({
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
    borderColor: ICE_BLUE,
    "&:focus": {
      backgroundColor: OFF_BLACK_4,
      color: ICE_BLUE,
      borderColor: ICE_BLUE,
    }
  },
  fieldLabel: {
    color: ICE_BLUE,
    fontSize: 18,
    marginBottom: 0,
    marginTop: 10,
  },
  parameterWrapper: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr",
    alignItems: 'center'
  }, 
  button: {
    backgroundColor: ICE_BLUE, 
    width: "90%", 
    margin: "auto" 
  }
})

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
      latitude: "",
      longitude: "",
      types: "",
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
      latitude: "",
      longitude: "",
      main_type: "",
      types: "",
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
    const classes = this.props.classes;

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
    console.log(placeTypes[placeTypes.length - 1])

    return (
      <React.Fragment>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={classes.modal}>
          <ModalHeader toggle={this.toggle} className={classes.modalHeader}>Add Place</ModalHeader>
          <ModalBody className={classes.modalBody} >
            {!this.props.addPlaceRequestPending ?
              <Form ref={ref => this.formAddCity = ref} onSubmit={e => this.props.handleAddPlace(e, this.state)}>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={options[this.props.default.index]}
                  isSearchable={true}
                  options={options}
                  onChange={this.dropdownSelect}
                  // defaultMenuIsOpen={true}
                  styles={reactSelectStyling}
                />
                <br />
                <div className={clsx(classes.parameterWrapper)}>
                  <span style={{ textAlign: "center", color: ICE_BLUE }}>Search Radius</span>
                  <Input
                    type="text"
                    boof="searchRadius"
                    value={this.state.searchRadius}
                    onChange={this.handleChange}
                    className={classes.inputStyle}
                    autoComplete={"new-password"}

                  />
                  <span style={{ textAlign: "left", marginLeft: 10, color: ICE_BLUE }}>Miles</span>
                  <span style={{ textAlign: "right", color: ICE_BLUE }}>Strict Bounds?</span>
                  <Checkbox
                    checked={this.state.strictBounds}
                    onChange={this.handleChangeCheckbox}
                    name="strictBounds"
                    style={{ color: '#0095d2' }}

                  />
                </div>
                <p className={clsx(classes.fieldLabel)}>Name:</p>
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
                  inputStyle={{
                    backgroundColor: OFF_BLACK_4,
                    color: ICE_BLUE,
                    borderColor: ICE_BLUE,
                  }}
                  setError={this.props.setError}
                />
                <p className={clsx(classes.fieldLabel)}>Type:</p>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  options={placeTypes}
                  styles={reactSelectStyling}
                  defaultValue={placeTypes[placeTypes.length - 1]}
                  onChange={option => {
                    this.setState({
                      main_type: option.value
                    })
                  }}
                  value={placeTypes.find(el => el.value === this.state.main_type)}
                />
                <p className={classes.fieldLabel}>Address:</p>
                <Input
                  type="text"
                  boof="address"
                  value={this.state.address}
                  onChange={this.handleChange}
                  className={classes.inputStyle}
                  autoComplete={"new-password"}
                />
                <p className={classes.fieldLabel}>City:</p>
                <Input
                  type="text"
                  boof="city"
                  value={this.state.city}
                  onChange={this.handleChange}
                  className={classes.inputStyle}
                  autoComplete={"new-password"}
                />
                <p className={classes.fieldLabel}>State:</p>

                <Input
                  type="text"
                  boof="state"
                  value={this.state.state}
                  onChange={this.handleChange}
                  className={classes.inputStyle}
                  autoComplete={"new-password"}
                />
                <p className={classes.fieldLabel}>Country:</p>

                <Input
                  type="text"
                  boof="country"
                  value={this.state.country}
                  onChange={this.handleChange}
                  className={classes.inputStyle}
                  autoComplete={"new-password"}
                />
                <p className={classes.fieldLabel}>Zip Code:</p>

                <Input
                  type="text"
                  boof="zip"
                  value={this.state.zip}
                  onChange={this.handleChange}
                  className={classes.inputStyle}
                  autoComplete={"new-password"}
                />
                <p className={classes.fieldLabel}>Latitude:</p>

                <Input
                  type="text"
                  boof="latitude"
                  value={this.state.latitude}
                  onChange={this.handleChange}
                  className={classes.inputStyle}
                  autoComplete={"new-password"}
                />
                <p className={classes.fieldLabel}>Longitude:</p>

                <Input
                  type="text"
                  boof="longitude"
                  value={this.state.longitude}
                  onChange={this.handleChange}
                  className={classes.inputStyle}
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
          <ModalFooter className={classes.modalFooter}>
            <Button onClick={this.submitForm} disabled={!this.allFieldsValid()} className={clsx(classes.button)}>Submit</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(AddPlace);
