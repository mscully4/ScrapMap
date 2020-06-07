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
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles'
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'
import RingLoader from "react-spinners/RingLoader";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { validateString, validateLatitude, validateLongitude } from '../../utils/validators'


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

class EditPlace extends React.Component {
  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.data,

      pictures: [],
      pictureNames: [],
    };
  }

  handleChange = e => {
    const name = e.target.getAttribute('boof')
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

  submitForm = () => {
    ReactDOM.findDOMNode(this.formEditPlace).dispatchEvent(new Event("submit"));
    this.props.toggle()
  }

  hasBeenChanged = () => {
    const { name, address, city, state, country, zip_code, latitude, longitude, main_type } = this.props.data
    return (this.state.name !== name ||
      this.state.address !== address ||
      this.state.city !== city ||
      this.state.state !== state ||
      this.state.country !== country ||
      this.state.zip_code !== zip_code ||
      this.state.latitude !== latitude ||
      this.state.longitude !== longitude ||
      this.state.main_type !== main_type
    )
  }

  allFieldsValid = () => {
    return validateString(this.state.city, 60, false) &&
      this.state.name.length <= 120 &&
      validateString(this.state.country, 50, false) &&
      this.state.main_type !== "" &&
      validateLatitude(this.state.latitude) &&
      validateLongitude(this.state.longitude)
  }

  capitalize = (str) => {
    let result = str.charAt(0).toUpperCase()
    for (var i = 1; i < str.slice(1).length + 1; ++i) {
      result += str.charAt(i - 1) === " " ? str.charAt(i).toUpperCase() : str.charAt(i)
    }
    return result
  }

  render() {
    const buttonDisabled = this.props.editPlaceRequestPending || !this.hasBeenChanged() || !this.allFieldsValid();
    const classes = this.props.classes

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

    const MenuProps={
      classes: {
        paper: classes.menuPaper
      }
    }

    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader className={classes.modalHeader} toggle={this.props.toggle}>Edit Place</ModalHeader>
        <ModalBody className={classes.modalBody}>
          {!this.props.requestPending ? (
            <Form ref={ref => this.formEditPlace = ref} onSubmit={e => this.props.handleEditPlace(e, this.state)} >
              <TextField
                label={"Name"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.name}
                inputProps={{ "boof": "name", 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={this.state.name.length > 120}
                helperText={this.state.name.length > 120 ? "Must less than 120 characters" : null}
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
                onChange={this.handleChange}
                value={this.state.address}
                inputProps={{ "boof": "address", 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={this.state.address.length > 150}
                helperText={this.state.address.length > 150 ? "Must be either blank or less than 150 characters" : null}
              />
              <TextField
                label={"City"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.city}
                inputProps={{ "boof": "city", 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(this.state.city, 60, true)}
                helperText={!validateString(this.state.city, 60, true) ? "Must be shorter than 60 characters and contain only alphabetical characters" : null}
              />
              <TextField
                label={"State"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.state}
                inputProps={{ "boof": "state", 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(this.state.state, 25, true)}
                helperText={!validateString(this.state.state, 25, true) ? "Must be either blank or shorter than 25 characters and contain only alphabetical characters" : null}
              />
              <TextField
                label={"Country"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.country}
                inputProps={{ "boof": "country", 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateString(this.state.country, 50, true)}
                helperText={!validateString(this.state.country, 50, true) ? "Must be shorter than 50 characters and contain only alphabetical characters" : null}
              />
              <TextField
                label={"Zip Code"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.zip_code}
                inputProps={{ "boof": "zip_code", 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={this.state.zip_code.length > 6}
                helperText={this.state.zip_code.length > 6 ? "Must be either blank or less than 6 characters" : null}
                />
              <TextField
                label={"Latitude"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.latitude}
                inputProps={{ "boof": "latitude", 'autoComplete': 'new-password' }}
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
                inputProps={{ "boof": "longitude", 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
                error={!validateLongitude(this.state.longitude) && this.state.longitude !== ""}
                helperText={!validateLongitude(this.state.longitude) && this.state.longitude !== "" ? "Must be a number between -180 and 180" : null}                  
              />
            </Form>) :
            <RingLoader
              color={"#0095d2"}
              loading={true}
              css={`margin: auto`}
              size={200}
            />}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button className={classes.button} disabled={buttonDisabled} onClick={this.submitForm}>Submit</Button>
        </ModalFooter>
      </Modal>)
  }
}

export default withStyles(styles)(EditPlace);