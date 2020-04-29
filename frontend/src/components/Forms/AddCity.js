import React from 'react';
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
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'
import RingLoader from "react-spinners/RingLoader";

import Autocomplete from './Autocomplete';

const styles = {
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
  }
}

class AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAdd: false,
      city: "",
      country: "",
      countryCode: "",
      latitude: null,
      longitude: null,
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
      latitude: null,
      longitude: null,
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
    const inputStyle = {
      backgroundColor: OFF_BLACK_4,
      color: ICE_BLUE,
      borderColor: ICE_BLUE
    }
    return (
      <React.Fragment>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          style={{
            backgroundColor: "#000"
          }}
        >
          <ModalHeader
            toggle={this.toggle}
            style={{
              backgroundColor: OFF_BLACK_2,
              color: ICE_BLUE,
              border: "none"
            }}
          >
            Add City
          </ModalHeader>
          <ModalBody style={{ backgroundColor: OFF_BLACK_3 }}>
            {!this.props.addCityRequestPending ?
              <Form ref={ref => this.formAddCity = ref} onSubmit={e => this.props.handleAddCity(e, this.state)} autoComplete={"new-password"}>
                <p style={styles.fieldLabel}>City:</p>
                <Autocomplete
                  name="city"
                  placeholder="city"
                  value={this.state.city}
                  selectAutoSuggestCity={this.selectAutoSuggest}
                  context={"City"}
                  handleAutoCompleteChangeCity={this.handleAutoCompleteChange}
                  value={this.state.city}
                  clearSuggestionsHook={this.clearSuggestionsHook}
                  inputStyle={inputStyle}
                />
                <p style={styles.fieldLabel}>Country:</p>
                <Input
                  type="text"
                  boof="country"
                  // placeholder="Country"
                  value={this.state.country}
                  onChange={this.handleChange}
                  autoComplete={"new-password"}
                  style={inputStyle}
                />
                <p style={styles.fieldLabel}>Country Code:</p>
                <Input
                  type="text"
                  boof="countryCode"
                  // placeholder="Country Code"
                  value={this.state.countryCode}
                  onChange={this.handleChange}
                  autoComplete={"new-password"}
                  style={inputStyle}
                />
                <p style={styles.fieldLabel}>Latitude:</p>
                <Input
                  type="text"
                  boof="latitude"
                  // placeholder="Latitude"
                  value={this.state.latitude}
                  onChange={this.handleChange}
                  style={inputStyle}
                />
                <p style={styles.fieldLabel}>Longitude:</p>
                <Input
                  type="text"
                  boof="longitude"
                  // placeholder="Longitude"
                  value={this.state.longitude}
                  onChange={this.handleChange}
                  style={inputStyle}
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
          <ModalFooter style={{ backgroundColor: OFF_BLACK_2, border: "none" }}>
            <Button onClick={this.submitForm} disabled={disableButtom} style={{ backgroundColor: ICE_BLUE, width: '90%', margin: "auto" }}>Submit</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }
}

export default AddCity;
