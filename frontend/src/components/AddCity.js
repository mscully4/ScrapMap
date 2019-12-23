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
import PlacesAutocomplete from './PlacesAutocomplete';
const styles = {
  addIcon: {
    height: 40,
    width: 40,
    cursor: 'pointer',
  }
}

class AddCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          modalAdd: false,
          data: {city: "", country: "", latitude: "", longitude: ""},
          username: "",
          files: [],
          disabled: false,  //figure out a way to keep this true until a key is entered in city, maybe use an event listener
        };

        this.toggleAdd = this.toggleAdd.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.formRef = React.createRef();
    }

    handleChange = e => {
      console.log(e.target.name)
      const name = e.target.name;
      const value = e.target.value;
      this.setState(prevState => {
        const newState = { ...prevState };
        newState[name] = value;
        return newState;
      });
    };

    handleImageChange = e => {
      const name = e.target.name;
      const value = e.target.value;
        console.log(name, value);
        this.setState({
            files: e.target.files,
        })
    }

    onClick() {
        console.log("click");
    }

    toggleAdd() {
      this.setState(prevState => ({
        modalAdd: !prevState.modalAdd,
      }));
    }

    submitForm() {
      ReactDOM.findDOMNode(this.formAddCity).dispatchEvent(new Event("submit"))
      this.toggleAdd();
    }

    selectAutoSuggest = (obj) => {
      this.setState({
        data: obj
      })
    }

    render() {      
      return (
        <React.Fragment>
        <svg
          style={styles.addIcon}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          onClick={this.toggleAdd}
        >
          <path
            d="M512 16C240 16 16 240 16 512s224 496 496 496 496-224 496-496S784 16 512 16z m0 960C256 976 48 768 48 512S256 48 512 48 976 256 976 512 768 976 512 976z"
            fill="#737373"
          />
          <path
            d="M736 480h-192V288c0-19.2-12.8-32-32-32s-32 12.8-32 32v192H288c-19.2 0-32 12.8-32 32s12.8 32 32 32h192v192c0 19.2 12.8 32 32 32s32-12.8 32-32v-192h192c19.2 0 32-12.8 32-32s-12.8-32-32-32z"
            fill="#737373"
          />
        </svg>

        <Modal isOpen={this.state.modalAdd} toggle={this.toggleAdd}>
          <ModalHeader toggle={this.toggleAdd}>Add City</ModalHeader>
            <ModalBody>
              <Form id="addCityForm" ref={ref => this.formAddCity = ref} onSubmit={e => this.props.handleAddCity(e, this.state)}>
                <PlacesAutocomplete
                  name="city"
                  placeholder="city"
                  value={this.state.data.city}
                  selectAutoSuggest={this.selectAutoSuggest}
                />
                {/* <Input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={this.state.city}
                  onChange={this.handleChange}
                /> */}
                <br />
                <Input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={this.state.data.country}
                  onChange={this.handleChange}
                  disabled={this.state.disabled}
                />
                <br />
                <Input 
                  type="text"
                  name="latitude"
                  placeholder="Latitude"
                  value={this.state.data.latitude}
                  onChange={this.handleChange}
                  disabled={this.state.disabled}
                />
                <br />
                <Input
                  type="text"
                  name="longitude"
                  placeholder="Longitude"
                  value={this.state.data.longitude}
                  onChange={this.handleChange}
                  disabled={this.state.disabled}
                />
                <br />
                <Input
                  multiple
                  type="file"
                  name="file"
                  onChange={this.handleImageChange}
                  />
              </Form>
            </ModalBody>
          <ModalFooter>
            <Button onClick={this.submitForm}>Submit</Button>
          </ModalFooter>
        </Modal>
        </React.Fragment>
      )
    }
}

export default AddCity;
