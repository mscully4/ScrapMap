import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import RingLoader from "react-spinners/RingLoader";
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles'
import clsx from 'clsx';
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'
import AutoComplete from './AutoComplete.js';
import { validateLatitude, validateLongitude, validateString } from '../../utils/validators'

const styles = themes => ({
  modal: {
    backgroundColor: "#000",
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
})

class AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAdd: false,
      city: "",
      country: "",
      countryCode: "",
      latitude: "",
      longitude: "",
    };

    this.clearSuggestions = null

  }

  clearSuggestionsHook = (func) => {
    this.clearSuggestions = func
  }

  handleChange = (e, name) => {
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  handleAutoCompleteChange = (value) => {
    this.setState({
      city: value
    })
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
      latitude: "",
      longitude: "",
      countryCode: "",
    })
  }

  allFieldsValid = () => {
    return 0 < this.state.city.length <= 120
      && 0 < this.state.country.length <= 120
      && validateString(this.state.countryCode, 2, true)
      && validateLatitude(this.state.latitude)
      && validateLongitude(this.state.longitude)
  }

  handleAddCity = (e) => {
    this.props.handleAddCity(e, this.state)
    this.props.toggle()
  }

  render() {
    const disableButton = !this.allFieldsValid();
   
    const classes = this.props.classes

    const inputProps = {
      className: clsx(classes.input),
      classes: {
        notchedOutline: clsx(classes.inputBorder),
      }
    }
    const InputLabelProps = {
      className: clsx(classes.inputLabel),
    }

    const { city, country, countryCode, latitude, longitude } = this.state
    return (
      <React.Fragment>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className={classes.modal}
        >
          <ModalHeader toggle={this.toggle} className={classes.modalHeader}>Add City</ModalHeader>
          {!this.props.requestPending ?
            <ModalBody className={classes.modalBody}>
              <AutoComplete
                selectAutoSuggest={this.selectAutoSuggest}
                context={"City"}
                handleAutoCompleteChange={this.handleAutoCompleteChange}
                clearSuggestionsHook={this.clearSuggestionsHook}
                setError={this.props.setError}
              />
              <TextField
                label={"Country"}
                variant={"outlined"}
                onChange={(e) => this.handleChange(e, "country")}
                value={country}
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={country.length > 120}
                helperText={country.length > 120 ? "Must be shorter than 120 characters" : null}
              />
              <TextField
                label={"Country Code"}
                variant={"outlined"}
                onChange={(e) => this.handleChange(e, "countryCode")}
                value={countryCode.toUpperCase()}
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(countryCode, 2, true) || (countryCode.length > 0 && countryCode.length !== 2)}
                helperText={!validateString(countryCode, 2, true) || (countryCode.length > 0 && countryCode.length !== 2) ? "Must be 2 alphabetical characters" : null}
              />
              <TextField
                label={"Latitude"}
                variant={"outlined"}
                onChange={(e) => this.handleChange(e, "latitude")}
                value={latitude}
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateLatitude(latitude) && latitude !== ""}
                helperText={!validateLatitude(latitude) && latitude !== "" ? "Must be a number between -90 and 90" : null}
              />
              <TextField
                label={"Longitude"}
                variant={"outlined"}
                onChange={(e) => this.handleChange(e, 'longitude')}
                value={longitude}
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateLongitude(this.state.longitude) && this.state.longitude !== ""}
                helperText={!validateLongitude(this.state.longitude) && this.state.longitude !== "" ? "Must be a number between -180 and 180" : null}
              />
            </ModalBody>
            :
            <div style={{backgroundColor: OFF_BLACK_1, paddingTop: 25, paddingBottom: 25}}>
              <RingLoader
                color={ICE_BLUE}
                loading={true}
                css={`margin: auto`}
                size={200}
              />
            </div>
          }
          <ModalFooter className={classes.modalFooter}>
            <Button onClick={this.handleAddCity} disabled={disableButton} className={classes.button}>Submit</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }
}

AddCity.propTypes = {
  handleAddCity: PropTypes.func,
  isOpen: PropTypes.bool,
  requestPending: PropTypes.bool,
  setError: PropTypes.func,
  toggle: PropTypes.func,
}

export default withStyles(styles)(AddCity);
