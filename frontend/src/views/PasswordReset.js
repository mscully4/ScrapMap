import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom'

import {
  Button,
  Form,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import { validateToken, changePassword } from '../utils/fetchUtils'
import { OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4, ICE_BLUE, FONT_GREY } from '../utils/colors'
import { passwordValidator, validatePassword } from '../utils/validators'

const baseURL = window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000/' : `${window.location.origin}/backend/`

const styles = theme => ({
  background: {
    backgroundColor: "#666",
    width: '100%',
    height: '1000px'
  },
  // modal: {
  //   // backgroundColor: "#000"
  // },
  modalHeader: {
    backgroundColor: OFF_BLACK_2,
    color: ICE_BLUE,
    border: "none",
    "& h5": {
      fontSize: 24
    }
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
    borderColor: ICE_BLUE,
    "&:focus": {
      backgroundColor: OFF_BLACK_4,
      color: ICE_BLUE,
      borderColor: ICE_BLUE,
    }
  },
  button: {
    backgroundColor: ICE_BLUE,
    width: "90%",
    margin: "auto"
  },
  textField: {
    width: '90%',
    marginLeft: '5% !important',
    marginBottom: '5% !important',
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
  listHeader: {
    fontSize: 20,
    textIndent: 20
  },
  listItems: {
    fontSize: 16
  },
  text: {
    color: ICE_BLUE
  }
})

class PasswordReset extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tokenIsValid: null,
      newPassword: "",
      newPasswordConfirmed: "",
    }
  }

  componentDidMount = () => {
    validateToken(this.props.token)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          this.setState({
            tokenIsValid: true
          })
        }
      })
  }

  handleChange = e => {
    const name = e.target.getAttribute("boof");
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  handleChangePassword = (e, name) => {
    const value = this.state[name] + e.target.value.slice(-1);
    if (e.target.value.length < this.state[name].length) {
      this.setState({
        [name]: this.state[name].slice(0, e.target.value.length)
      })
    } else {
      this.setState({
        [name]: value
      })
    }
  }

  submitNewPassword = () => {
    changePassword(this.props.token, this.state.newPassword)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            redirect: true
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  passwordIsValid = () => {
    return this.state.newPassword === this.state.newPasswordConfirmed
      && this.state.newPassword.length >= 8
      && validatePassword(this.state.newPassword)
  }

  render() {
    const classes = this.props.classes
    const buttonDisabled = !this.passwordIsValid()
    let modal;

    const inputProps = {
      className: clsx(classes.input),
      classes: {
        notchedOutline: clsx(classes.inputBorder),
      }
    }
    const InputLabelProps = {
      className: clsx(classes.inputLabel),
    }

    if (this.state.redirect) {
      modal = (<Redirect to="/" />)
    }
    else if (this.state.tokenIsValid) {
      modal = (
        <Modal isOpen={true} className={classes.modal}>
          <ModalHeader className={classes.modalHeader}>Password Reset</ModalHeader>
          <ModalBody className={classes.modalBody}>
            <h4 className={clsx(classes.text, classes.listHeader)}>{"Password Criteria:"}</h4>
            <ul>
              <li className={clsx(classes.text, classes.listItems)}>{"Must be at least 8 characters long"}</li>
              <li className={clsx(classes.text, classes.listItems)}>{" Allowed Characters are a-z, A-Z, 1-9 and !@#$%^&*()-_=+<,>./?"}</li>
            </ul>
            <TextField
              label={"Password"}
              variant={"outlined"}
              onChange={(e) => this.handleChangePassword(e, "newPassword")}
              value={"*".repeat(this.state.newPassword.length)}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
            />

            <TextField
              label={"Confirm Password"}
              variant={"outlined"}
              onChange={(e) => this.handleChangePassword(e, "newPasswordConfirmed")}
              value={"*".repeat(this.state.newPasswordConfirmed.length)}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
            />
          </ModalBody>
          <ModalFooter className={classes.modalFooter}>
            <Button className={classes.button} onClick={this.submitNewPassword} disabled={buttonDisabled}>Submit</Button>
          </ModalFooter>
        </Modal>
      )
    }
    else {
      modal = (
        <Modal isOpen={true} className={classes.modal}>
          <ModalHeader className={classes.modalHeader}>Password Reset</ModalHeader>
          <ModalBody className={classes.modalBody}>
            <div className={classes.text}>Error: Invalid Token</div>
          </ModalBody>
        </Modal>
      )
    }

    return (
      <div className={classes.background}>
        {modal}
      </div>)
  }
}

export default withStyles(styles)(PasswordReset)