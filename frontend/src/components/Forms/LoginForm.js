import React from 'react';
import ReactDOM from 'react-dom'
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
import TextField from '@material-ui/core/TextField';
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles';
import RingLoader from "react-spinners/RingLoader";

const styles = theme => ({
  fieldLabel: {
    color: ICE_BLUE,
    fontSize: 18,
    marginBottom: 5,
    marginTop: 10,
    marginLeft: '5%'
  },
  textField: {
    width: '90%',
    marginLeft: '5% !important',
    marginTop: '5% !important'
  },
  modal: {
    backgroundColor: "#000"
  },
  modalHeader: {
    backgroundColor: OFF_BLACK_2,
    color: ICE_BLUE,
    border: "none",
    fontSize: 24
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
    width: '90%',
    margin: "auto"
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

class LoginForm extends React.Component {
  state = {
    username: "",
    password: "",
    showLoader: false,
  };

  handleChange = e => {
    const name = e.target.getAttribute("boof");
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    })
  }

  handleChangePassword = e => {
    const value = this.state.password + e.target.value.slice(-1);
    if (e.target.value.length < this.state.password.length) {
      this.setState({
        password: this.state.password.slice(0, e.target.value.length )
      })
    } else {
      this.setState({
        password: value
      })
    }
  }

  submitForm = () => {
    ReactDOM.findDOMNode(this.formLogin).dispatchEvent(new Event("submit"))
    this.setState({
      username: "",
      password: ""
    })
  }

  allFieldsValid = () => { 
    return this.state.username !== "" && this.state.password !== ""
  }

  render() {
    const classes = this.props.classes

    const inputProps = {
      className: clsx(classes.input),
      classes: {
        notchedOutline: clsx(classes.inputBorder),
      }
    }
    const InputLabelProps={
      className: clsx(classes.inputLabel),
    }

    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={classes.modal}>
        <ModalHeader toggle={this.props.toggle} className={classes.modalHeader}><p style={{fontSize:36, marginBottom: 0}}>Login</p></ModalHeader>
        <ModalBody style={styles.modalBody} className={classes.modalBody}>
          {!this.props.loadingUserData ?
            <Form ref={ref => this.formLogin = ref} onSubmit={e => this.props.handleLogin(e, this.state)}>
              <TextField 
              label={"Username"} 
              variant={"outlined"} 
              onChange={this.handleChange}
              value={this.state.username}
              inputProps={{"boof": "username"}}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              />
              <TextField 
              label={"Password"} 
              variant={"outlined"} 
              onChange={this.handleChangePassword}
              value={"*".repeat(this.state.password.length)}
              inputProps={{"boof": "password"}}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              />
            </Form> :
            <RingLoader
              color={"#0095d2"}
              loading={true}
              css={`margin: auto`}
              size={200}
            />}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button disabled={this.props.loadingUserData || !this.allFieldsValid()} onClick={this.submitForm} className={classes.button}>Submit</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default withStyles(styles)(LoginForm);


LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
};
