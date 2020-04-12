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
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../utils/colors'
import RingLoader from "react-spinners/RingLoader";

const style = {
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
    ReactDOM.findDOMNode(this.formEditPlace).dispatchEvent(new Event("submit"))
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
    const form = !this.props.editPlaceRequestPending ? (
      <Form ref={ref => this.formEditPlace = ref} onSubmit={e => this.props.handleEditPlace(e, this.state)} >
        <p style={style.fieldLabel}>Name:</p>
        <Input
          type="text"
          boof="name"
          value={this.state.name}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          style={style.inputStyle}
        />
        <p style={style.fieldLabel}>Address:</p>
        <Input
          type="text"
          boof="address"
          value={this.state.address}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          style={style.inputStyle}
        />
        <p style={style.fieldLabel}>City:</p>
        <Input
          type="text"
          boof="city"
          value={this.state.city}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          style={style.inputStyle}
        />
        <p style={style.fieldLabel}>State:</p>
        <Input
          type="text"
          boof="state"
          value={this.state.state}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          style={style.inputStyle}
        />
        <p style={style.fieldLabel}>Country:</p>
        <Input
          type="text"
          boof="country"
          value={this.state.country}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          style={style.inputStyle}
        />
        <p style={style.fieldLabel}>Zip:</p>
        <Input
          type="text"
          boof="zip_code"
          value={this.state.zip_code}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          style={style.inputStyle}
        />
        <p style={style.fieldLabel}>Latitude:</p>
        <Input
          type="text"
          boof="latitude"
          placeholder="Latitude"
          value={this.state.latitude}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          style={style.inputStyle}
        />
        <p style={style.fieldLabel}>Longitude:</p>
        <Input
          type="text"
          boof="longitude"
          placeholder="Longitude"
          value={this.state.longitude}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          style={style.inputStyle}
        />
      </Form>) : <RingLoader
            color={"#0095d2"}
            loading={true}
            css ={`margin: auto`}
            // ; height: ${window.innerHeight}px; width: ${window.innerWidth}px`}
            size={200}
          />
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader style={style.modalHeader} toggle={this.props.toggle}>Edit Place</ModalHeader>
        <ModalBody style={style.modalBody}>
          {form}
        </ModalBody>
        <ModalFooter style={style.modalFooter}>
          <Button style={style.button} disabled={buttonDisabled} onClick={this.submitForm}>Submit</Button>
        </ModalFooter>
      </Modal>)
  }
}

export default EditPlace;