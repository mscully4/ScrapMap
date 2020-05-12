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
import RingLoader from "react-spinners/RingLoader";
import { withStyles } from '@material-ui/styles'

import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'
import Autocomplete from './Autocomplete';

const styles = themes => ({
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
  addIcon: {
    height: 40,
    width: 40,
    cursor: 'pointer',
  },
  fieldLabel: {
    color: ICE_BLUE,
    fontSize: 18,
    marginBottom: 0,
    marginTop: 10
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
      pictures: [],
      pictureNames: [],
    };

    this.clearSuggestions = null

  }

  clearSuggestionsHook = (func) => {
    this.clearSuggestions = func
  }

  handleChange = e => {
    const name = e.target.getAttribute("boof");
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
      city: "",
      country: "",
      latitude: "",
      longitude: "",
      countryCode: "",
      hover: false,
    })
  }

  allFieldsValid = () => {
    return this.state.city !== "" &&
      this.state.country !== "" &&
      this.state.countryCode !== "" &&
      this.state.latitude !== null &&
      this.state.longitude !== null ? true : false;
  }

  render() {
    const disableButtom = !this.allFieldsValid();
    const classes = this.props.classes
  
    return (
      <React.Fragment>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className={classes.modal}
        >
          <ModalHeader
            toggle={this.toggle}
            className={classes.modalHeader}
          >
            Add City
          </ModalHeader>
          <ModalBody className={classes.modalBody}>
            {!this.props.addCityRequestPending ?
              <Form ref={ref => this.formAddCity = ref} onSubmit={e => this.props.handleAddCity(e, this.state)} autoComplete={"new-password"}>
                <p className={classes.fieldLabel}>City:</p>
                <Autocomplete
                  name="city"
                  placeholder="city"
                  value={this.state.city}
                  selectAutoSuggestCity={this.selectAutoSuggest}
                  context={"City"}
                  handleAutoCompleteChangeCity={this.handleAutoCompleteChange}
                  value={this.state.city}
                  clearSuggestionsHook={this.clearSuggestionsHook}
                  inputStyle={{
                    backgroundColor: OFF_BLACK_4,
                    color: ICE_BLUE,
                    borderColor: ICE_BLUE,
                  }}
                  setError={this.props.setError}
                />
                <p className={classes.fieldLabel}>Country:</p>
                <Input
                  type="text"
                  boof="country"
                  value={this.state.country}
                  onChange={this.handleChange}
                  autoComplete={"new-password"}
                  className={classes.inputStyle}
                />
                <p className={classes.fieldLabel}>Country Code:</p>
                <Input
                  type="text"
                  boof="countryCode"
                  value={this.state.countryCode}
                  onChange={this.handleChange}
                  autoComplete={"new-password"}
                  className={classes.inputStyle}
                />
                <p className={classes.fieldLabel}>Latitude:</p>
                <Input
                  type="text"
                  boof="latitude"
                  value={this.state.latitude}
                  onChange={this.handleChange}
                  className={classes.inputStyle}
                />
                <p className={classes.fieldLabel}>Longitude:</p>
                <Input
                  type="text"
                  boof="longitude"
                  // placeholder="Longitude"
                  value={this.state.longitude}
                  onChange={this.handleChange}
                  className={classes.inputStyle}
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
            <Button onClick={this.submitForm} disabled={disableButtom} className={classes.button}>Submit</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(AddCity);
