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
import { withStyles } from '@material-ui/styles'
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'
import TextField from '@material-ui/core/TextField';
import RingLoader from "react-spinners/RingLoader";
import { validateLatitude, validateLongitude, validateString } from '../../utils/validators'

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
    borderColor: ICE_BLUE
  },
  button: {
    width: '90%',
    margin: '10px auto',
    backgroundColor: ICE_BLUE,
  },
  fieldLabel: {
    color: ICE_BLUE,
    fontSize: 18,
    marginBottom: 0,
    marginTop: 10
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

class EditCity extends React.Component {
  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.data,
      disabled: false,
    };
  }

  handleChange = e => {
    const name = e.target.getAttribute("boof")
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

  clear = () => {
    this.setState({
      city: "",
      country: "",
      countryCode: "",
      latitude: null,
      longitude: null,
    })
  }

  submitForm = () => {
    ReactDOM.findDOMNode(this.formEditCity).dispatchEvent(new Event("submit"))
    this.props.toggle();
  }

  hasBeenChanged = () => {
    return (
      this.state.country !== this.props.data.country ||
      this.state.city !== this.props.data.city ||
      this.state.countryCode !== this.props.data.countryCode ||
      this.state.latitude !== this.props.data.latitude ||
      this.state.longitude !== this.props.data.longitude
    )
  }

  allFieldsValid = () => {
    return validateString(this.state.city, 120)
      && validateString(this.state.country, 120)
      && validateString(this.state.countryCode, 2)
      && this.state.countryCode.length === 2
      && validateLatitude(this.state.latitude)
      && validateLongitude(this.state.longitude)
  }

  render() {
    const buttonDisabled = !this.hasBeenChanged() || this.props.requestPending || !this.allFieldsValid();
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

    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader className={classes.modalHeader} toggle={this.props.toggle}>Edit City</ModalHeader>
        <ModalBody className={classes.modalBody}>
          {!this.props.requestPending ?
            <Form ref={ref => this.formEditCity = ref} onSubmit={e => this.props.handleEditCity(e, this.state)}>
              <TextField
                label={"City"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.city}
                inputProps={{ "boof": "city", "autoComplete": 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(this.state.city, 120) && this.state.city !== ""}
                helperText={!validateString(this.state.city, 120) && this.state.city != "" ? "Must be shorter than 120 characters and contain only alphabetical characters" : null}
              />
              <TextField
                label={"Country"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.country}
                inputProps={{ "boof": "country", "autoComplete": 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(this.state.country, 120) && this.state.country !== ""}
                helperText={!validateString(this.state.country, 120) && this.state.country != "" ? "Must be shorter than 120 characters and contain only alphabetical characters" : null}
              />
              <TextField
                label={"Country Code"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.countryCode.toUpperCase()}
                inputProps={{ "boof": "countryCode", "autoComplete": 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(this.state.countryCode, 2) && this.state.countryCode !== "" || this.state.countryCode.length !== 2}
                helperText={!validateString(this.state.country, 120) 
                  && this.state.countryCode !==  "" 
                  && this.state.countryCode.length !== 2 ? "Must be 2 alphabetical characters" : null}
              />
              <TextField
                label={"Latitude"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.latitude}
                inputProps={{ "boof": "latitude", "autoComplete": 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateLatitude(this.state.latitude) && this.state.latitude !== ""}
                helperText={!validateLatitude(this.state.latitude) && this.state.latitude !== "" ? "Must be a number between -90 and 90" : null}
              />
              <TextField
                label={"Longitude"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.longitude}
                inputProps={{ "boof": "longitude", "autoComplete": 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateLongitude(this.state.longitude) && this.state.longitude !== ""}
                  helperText={!validateLongitude(this.state.longitude) && this.state.longitude !== "" ? "Must be a number between -180 and 180" : null} 
              />
            </Form> :
            <RingLoader
              color={"#0095d2"}
              loading={true}
              css={`margin: auto`}
              // ; height: ${window.innerHeight}px; width: ${window.innerWidth}px`}
              size={200}
            />
          }
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button disabled={buttonDisabled} onClick={this.submitForm} className={clsx(classes.button)}>Submit</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default withStyles(styles)(EditCity);
// export default EditCity;
