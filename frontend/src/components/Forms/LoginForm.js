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
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4, ERROR_RED } from '../../utils/colors'
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles';
import RingLoader from "react-spinners/RingLoader";
import { validateEmail } from '../../utils/validators'
import { requestToken } from '../../utils/fetchUtils'

const styles = theme => ({
  fieldLabel: {
    color: ICE_BLUE,
    fontSize: 18,
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
  inputError: {
    color: ERROR_RED
  },
  inputLabel: {
    color: `${ICE_BLUE} !important`
  },
  inputLabelError: {
    color: `${ERROR_RED} !important`
  },
  inputBorder: {
    borderWidth: '1px',
    borderColor: `${ICE_BLUE} !important`
  },
  inputBorderError: {
    borderWidth: '1px',
    borderColor: `${ERROR_RED} !important`
  },
  forgotPassword: {
    color: ICE_BLUE,
    cursor: 'pointer',
    marginLeft: '5%',
    marginTop: 5,
    display: 'inline',
    "&:hover": {
      textDecoration: 'underline',
      // fontWeight: 'bold'
    }
  }
})

class LoginForm extends React.Component {
  state = {
    username: "",
    password: "",
    showLoader: false,
    showForgotPassword: false,
    email: "",
    passwordResetRequestSuccess: null,
    passwordResetRequestPending: false
  };

  handleChange = (e, name) => {
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
        password: this.state.password.slice(0, e.target.value.length)
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
      password: ""
    })
  }

  loginFieldsValid = () => {
    return this.state.username !== "" && this.state.password !== ""
  }

  inputProps = (err) => {
    const classes = this.props.classes
    return {
      className: err ? classes.inputError : classes.input,
      classes: {
        notchedOutline: err ? classes.inputBorderError : classes.inputBorder,
      }
    }
  }

  inputLabelProps = (err) => {
    const classes = this.props.classes
    return {
      className: err ? classes.inputLabelError : classes.inputLabel,
    }
  }

  userNotFound = (error) => {
    return error.status === 404
      && error.message
      && error.message === 'User Not Found'
  }

  incorrectPassword = (error) => {
    return error.status === 400
      && error.message.non_field_errors
      && error.message.non_field_errors.includes("Unable to log in with provided credentials.")
  }

  submitPasswordResetRequest = () => {
    this.setState({
      passwordResetRequestPending: true
    }, () => {
      requestToken(this.state.email)
        .then(response => {
          this.setState({
            passwordResetRequestSuccess: response.status === 200,
            showForgotPassword: response.status === 200 ? false : true,
            passwordResetRequestPending: false
          })
        })
    })
  }

  render() {
    const classes = this.props.classes
    const error = this.props.error
    var body, buttonDisabled, onClick;

    if (this.state.showForgotPassword) {
      onClick = this.submitPasswordResetRequest
      buttonDisabled = !validateEmail(this.state.email) || this.state.passwordResetRequestPending
      body = (
        <ModalBody style={styles.modalBody} className={classes.modalBody}>
          <div className={classes.fieldLabel}>Enter the email address associated with your account</div>
          <TextField
            label={"Email"}
            variant={"outlined"}
            onChange={(e) => this.handleChange(e, 'email')}
            value={this.state.email}
            InputProps={this.inputProps(false)}
            InputLabelProps={this.inputLabelProps(false)}
            className={classes.textField}
            helperText={this.state.passwordResetRequestSuccess === false ? "No User Found with that Email Address" : null}
            error={this.state.passwordResetRequestSuccess === false}
          />
        </ModalBody>)
    } else if (this.state.passwordResetRequestSuccess === true) {
      onClick = null
      buttonDisabled = true
      body = (
        <ModalBody style={styles.modalBody} className={classes.modalBody}>
          <div className={classes.fieldLabel}>An email with instructions for reseting your password has been sent to {this.state.email}</div>
        </ModalBody>
      )
    }
    else if (this.props.loadingUserData) {
      buttonDisabled = this.props.loadingUserData
      body = (
        <ModalBody style={styles.modalBody} className={classes.modalBody}>
          <RingLoader
            color={"#0095d2"}
            loading={true}
            css={`margin: auto`}
            size={200}
          />
        </ModalBody>
      )
    } else {
      buttonDisabled = !this.loginFieldsValid();
      onClick = (e) => this.props.handleLogin(e, this.state);
      body = (
        <ModalBody style={styles.modalBody} className={classes.modalBody}>
          <TextField
            label={"Username"}
            variant={"outlined"}
            onChange={(e) => {
              this.handleChange(e, 'username')
              if (this.userNotFound(error)) {
                this.props.setError({
                  error: {
                    show: false,
                    status: null,
                    statusText: "",
                    message: []
                  }
                })
              }
            }}
            value={this.state.username}
            InputProps={this.inputProps(this.props.error.status === 404)}
            InputLabelProps={this.inputLabelProps(this.props.error.status === 404)}
            className={classes.textField}
            helperText={this.userNotFound(error) ? "User Not Found" : null}
            error={this.userNotFound(error)}
          />
          <TextField
            label={"Password"}
            variant={"outlined"}
            onChange={(e) => {
              this.handleChangePassword(e, 'password')
              console.log(this.incorrectPassword(error))
              if (this.incorrectPassword(error)) {
                this.props.setError({
                  show: false,
                  status: null,
                  statusText: "",
                  message: []
                })
              }
            }}
            value={"*".repeat(this.state.password.length)}
            InputProps={this.inputProps(this.props.error.status === 400)}
            InputLabelProps={this.inputLabelProps(this.props.error.status === 400)}
            className={classes.textField}
            error={this.incorrectPassword(this.props.error)}
            helperText={this.incorrectPassword(this.props.error) ? "Incorrect Password" : null}
            style={{ marginBottom: 5 }}
          />
          <div
            className={classes.forgotPassword}
            onClick={(e) => {
              this.setState({
                showForgotPassword: true
              })
            }}
          >Forgot Password?</div>
        </ModalBody>
      )
    }

    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={classes.modal}>
        <ModalHeader toggle={this.props.toggle} className={classes.modalHeader}><p style={{ fontSize: 36, marginBottom: 0 }}>Login</p></ModalHeader>
        {body}
        <ModalFooter className={classes.modalFooter}>
          <Button disabled={buttonDisabled} onClick={onClick} className={classes.button}>Submit</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default withStyles(styles)(LoginForm);


LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
};
