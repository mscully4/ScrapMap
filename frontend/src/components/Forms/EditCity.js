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

const style = {
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
  }
}

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
    // this.props.toggle();
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

  render() {
    const buttonDisabled = !this.hasBeenChanged() || this.props.editCityRequestPending;
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader style={style.modalHeader} toggle={this.props.toggle}>Edit City</ModalHeader>
        <ModalBody style={style.modalBody}>
          {!this.props.editCityRequestPending ?
            <Form ref={ref => this.formEditCity = ref} onSubmit={e => this.props.handleEditCity(e, this.state)} >
              <p style={style.fieldLabel}>City:</p>
              <Input
                type="text"
                boof="city"
                placeholder={this.props.data.city}
                value={this.state.city}
                onChange={this.handleChange}
                style={style.inputStyle}
                autoComplete={"new-password"}
              />
              <p style={style.fieldLabel}>Country:</p>
              <Input
                type="text"
                boof="country"
                placeholder={this.props.data.country}
                value={this.state.country}
                onChange={this.handleChange}
                style={style.inputStyle}
                autoComplete={"new-password"}
              />
              <p style={style.fieldLabel}>Country Code:</p>
              <Input
                type="text"
                boof="countryCode"
                placeholder={this.props.data.countryCode}
                value={this.state.countryCode}
                onChange={this.handleChange}
                style={style.inputStyle}
                autoComplete={"new-password"}
              />
              <p style={style.fieldLabel}>Latitude:</p>
              <Input
                type="text"
                boof="latitude"
                placeholder={this.props.data.latitude}
                value={this.state.latitude}
                onChange={this.handleChange}
                style={style.inputStyle}
                autoComplete={"new-password"}
              />
              <p style={style.fieldLabel}>Longitude:</p>
              <Input
                type="text"
                boof="longitude"
                placeholder={this.props.data.longitude}
                value={this.state.longitude}
                onChange={this.handleChange}
                style={style.inputStyle}
                autoComplete={"new-password"}
              />
              <br />
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
        <ModalFooter style={style.modalFooter}>
          <Button disabled={buttonDisabled} onClick={this.submitForm} style={style.button}>Submit</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default EditCity;