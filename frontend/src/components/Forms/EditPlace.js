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
    const { name, address, city, state, country, zip_code, latitude, longitude } = this.props.data
    return (this.state.name !== name ||
      this.state.address !== address ||
      this.state.city !== city ||
      this.state.state !== state ||
      this.state.country !== country ||
      this.state.zip_code !== zip_code ||
      this.state.latitude !== latitude ||
      this.state.longitude !== longitude
    )
  }

  render() {
    const buttonDisabled = this.props.editPlaceRequestPending || !this.hasBeenChanged();
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
              />
              <TextField
                label={"Address"}
                variant={"outlined"}
                onChange={this.handleChange}
                value={this.state.address}
                inputProps={{ "boof": "address", 'autoComplete': 'new-password' }}
                InputProps={inputProps}
                InputLabelProps={InputLabelProps}
                className={classes.textField}
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