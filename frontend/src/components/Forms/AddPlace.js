import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import clsx from 'clsx'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/styles'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { validateString, validateLatitude, validateLongitude } from '../../utils/validators'


import AutoComplete from './AutoComplete.js';
import RingLoader from "react-spinners/RingLoader";
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'


const styles = theme => ({
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
  parameterWrapper: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "2fr 1fr 1fr 3fr",
    alignItems: 'center',
    marginTop: '2.5%',
    marginLeft: '2.5%'
  },
  button: {
    backgroundColor: ICE_BLUE,
    width: "90%",
    margin: "auto"
  },
  textField: {
    width: '90%',
    marginLeft: '5% !important',
    marginTop: '5% !important'
  },
  input: {
    color: ICE_BLUE,
  },
  inputLabel: {
    color: `${ICE_BLUE} !important`
  },
  inputBorder: {
    borderWidth: '1px',
    borderColor: `${ICE_BLUE} !important`
  },
  selectDropdownIcon: {
    color: `${ICE_BLUE} !important`
  },
  select: {
    color: ICE_BLUE
  },
  selectWrapper: {
    "& fieldset": {
      borderColor: `${ICE_BLUE} !important`,

    }
  },
  formControl: {
    width: '90%',
    marginLeft: '5%',
    "& label": {
      color: `${ICE_BLUE} !important`
    }
  },
  menuPaper: {
    backgroundColor: `${OFF_BLACK_1} !important`,
    color: `${ICE_BLUE} !important`,
    "& ul li:hover": {
      color: OFF_BLACK_1,
      backgroundColor: `${ICE_BLUE} !important`
    }
  }
})

const MILES_TO_METERS = 1609.34

class AddPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closestCity: this.props.default,

      // strictBounds: true,
      searchRadius: 50,

      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
      latitude: "",
      longitude: "",
      types: "",
      main_type: "",
      placeId: "",
    };
    this.clearSuggestions = null
    this.clearInput = null 
  }

  clearSuggestionsHook = (func) => {
    this.clearSuggestions = func
  }

  clearInputHook = (func) => {
    this.clearInput = func
  }

  handleChange = (e, name) => {
    this.clearSuggestions()
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

  // handleChangeCheckbox = e => {
  //   this.clearSuggestions()
  //   this.setState({
  //     [e.target.name]: !this.state[e.target.name]
  //   })
  // }

  handleAutoCompleteChange = (value) => {
    this.setState({
      name: value
    })
  }

  // handleImageChange = (files, URLs) => {
  //   let pictures = this.state.pictures;
  //   let pictureNames = this.state.pictureNames
  //   for (let i = 0; i < files.length; ++i) {
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
      state: "",
      country: "",
      zip_code: "",
      latitude: "",
      longitude: "",
      types: "",
      main_type: "",
      placeId: "",
    })
  }

  allFieldsValid = () => {
    return validateString(this.state.city, 60, false) &&
      this.state.name.length <= 120 &&
      validateString(this.state.country, 50, false) &&
      this.state.main_type !== "" &&
      validateLatitude(this.state.latitude) &&
      validateLongitude(this.state.longitude)
  }

  changeMainType = (type) => {
    this.setState({
      main_type: type
    })
  }

  onChangeCity = (event) => {
    this.setState({
      closestCity: this.props.cities.find(el => el.city === event.target.value)
    })
    this.clearSuggestions()
    this.clear()
    this.clearInput()
  }

  capitalize = (str) => {
    let result = str.charAt(0).toUpperCase()
    for (var i = 1; i < str.slice(1).length + 1; ++i) {
      result += str.charAt(i - 1) === " " ? str.charAt(i).toUpperCase() : str.charAt(i)
    }
    return result
  }

  handleAddPlace = (e) => {
    this.props.handleAddPlace(e, this.state) 
    this.props.toggle()
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
    const placeTypes = this.props.placeTypes.map((obj, i) => {
      return {
        index: i,
        value: obj,
        label: this.capitalize(obj.replace('_', " "))
      }
    })

    const inputProps = {
      className: clsx(classes.input),
      classes: {
        notchedOutline: clsx(classes.inputBorder),
      }
    }
    const InputLabelProps = {
      className: clsx(classes.inputLabel),
    }

    const MenuProps = {
      classes: {
        paper: classes.menuPaper
      }
    }

    const buttonDisabled = !this.allFieldsValid() || this.props.requestPending
    return (
      <React.Fragment>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={classes.modal}>
          <ModalHeader toggle={this.toggle} className={classes.modalHeader}>Add Place</ModalHeader>
          {!this.props.requestPending ?
            <ModalBody className={classes.modalBody} >

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="city-label">City</InputLabel>
                <Select
                  value={this.state.closestCity.city}
                  className={clsx(classes.selectWrapper)}
                  classes={{
                    icon: clsx(classes.selectDropdownIcon),
                    select: clsx(classes.select)
                  }}
                  MenuProps={MenuProps}
                  onChange={this.onChangeCity}
                  label="City"
                >
                  {options.map((option) =>
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <br />
              <div className={clsx(classes.parameterWrapper)}>
                <span style={{ textAlign: "center", color: ICE_BLUE }}>Search Radius</span>
                <Input
                  type="text"
                  value={this.state.searchRadius}
                  onChange={e => this.handleChange(e, 'searchRadius')}
                  className={classes.inputStyle}
                  autoComplete={"new-password"}
                />
                <span style={{ textAlign: "left", marginLeft: 10, color: ICE_BLUE }}>Miles</span>
                {/* <span style={{ textAlign: "right", color: ICE_BLUE }}>Strict Bounds?</span>
                <Checkbox
                  checked={this.state.strictBounds}
                  onChange={this.handleChangeCheckbox}
                  name="strictBounds"
                  style={{ color: ICE_BLUE }}
                /> */}
              </div>
              <AutoComplete
                context={"Place"}
                location={{ lat: this.state.closestCity.latitude, lng: this.state.closestCity.longitude }}
                handleAutoCompleteChange={this.handleAutoCompleteChange}
                selectAutoSuggest={this.selectAutoSuggest}
                strictBounds={this.state.strictBounds}
                searchRadius={this.state.searchRadius * MILES_TO_METERS}
                clearSuggestionsHook={this.clearSuggestionsHook}
                clearInputHook={this.clearInputHook}
                changeMainType={this.changeMainType}
                placeTypes={this.props.placeTypes}
                setError={this.props.setError}
              />
              <FormControl variant="outlined" className={classes.formControl} style={{ marginTop: '4%' }}>
                <InputLabel id="place-type-label">Place Type</InputLabel>
                <Select
                  labelId="place-type-label"
                  value={this.state.main_type}
                  className={clsx(classes.selectWrapper)}
                  MenuProps={MenuProps}
                  classes={{
                    icon: clsx(classes.selectDropdownIcon),
                    select: clsx(classes.select)
                  }}
                  onChange={(event) => {
                    this.setState({
                      main_type: event.target.value
                    })
                  }}
                  label="Place Type"
                >
                  {placeTypes.map((option) =>
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                label={"Address"}
                variant={"outlined"}
                onChange={e => this.handleChange(e, 'address')}
                value={this.state.address}
                inputProps={{ 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={this.state.address.length > 150}
                helperText={this.state.address.length > 150 ? "Must be either blank or less than 150 characters" : null}
              />
              <TextField
                label={"City"}
                variant={"outlined"}
                onChange={e => this.handleChange(e, 'city')}
                value={this.state.city}
                inputProps={{ 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(this.state.city, 60, true)}
                helperText={!validateString(this.state.city, 60, true) ? "Must be shorter than 60 characters and contain only alphabetical characters" : null}
              />
              <TextField
                label={"State"}
                variant={"outlined"}
                onChange={e => this.handleChange(e, 'state')}
                value={this.state.state}
                inputProps={{ 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(this.state.state, 25, true)}
                helperText={!validateString(this.state.state, 25, true) ? "Must be either blank or shorter than 25 characters and contain only alphabetical characters" : null}
              />
              <TextField
                label={"Country"}
                variant={"outlined"}
                onChange={e => this.handleChange(e, 'country')}
                value={this.state.country}
                inputProps={{ 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(this.state.country, 50, true)}
                helperText={!validateString(this.state.country, 50, true) ? "Must be shorter than 50 characters and contain only alphabetical characters" : null}
              />

              <TextField
                label={"Zip Code"}
                variant={"outlined"}
                onChange={e => this.handleChange(e, 'zip')}
                value={this.state.zip_code}
                inputProps={{ 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={this.state.zip_code.length > 6}
                helperText={this.state.zip_code.length > 6 ? "Must be either blank or less than 6 characters" : null}
              />
              <TextField
                label={"Latitude"}
                variant={"outlined"}
                onChange={e => this.handleChange(e, "latitude")}
                value={this.state.latitude}
                inputProps={{ 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateLatitude(this.state.latitude) && this.state.latitude !== ""}
                helperText={!validateLatitude(this.state.latitude) && this.state.latitude !== "" ? "Must be a number between -90 and 90" : null}
              />
              <TextField
                label={"Longitude"}
                variant={"outlined"}
                onChange={e => this.handleChange('longitude')}
                value={this.state.longitude}
                inputProps={{ 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateLongitude(this.state.longitude) && this.state.longitude !== ""}
                helperText={!validateLongitude(this.state.longitude) && this.state.longitude !== "" ? "Must be a number between -180 and 180" : null}
              />
            </ModalBody>
            :
            <div style={{ backgroundColor: OFF_BLACK_1, paddingTop: 25, paddingBottom: 25 }}>
              <RingLoader
                color={ICE_BLUE}
                loading={true}
                css={`margin: auto`}
                size={200}
              />
            </div>
          }
          <ModalFooter className={classes.modalFooter}>
            <Button onClick={this.handleAddPlace} disabled={buttonDisabled} className={clsx(classes.button)}>Submit</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }
}

AddPlace.propTypes = {
  cities: PropTypes.array,
  default: PropTypes.object,
  handleAddPlace: PropTypes.func,
  isOpen: PropTypes.bool,
  placeTypes: PropTypes.array,
  requestPending: PropTypes.bool,
  setError: PropTypes.func,
  toggle: PropTypes.func,
}

export default withStyles(styles)(AddPlace);
