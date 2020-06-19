import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Input,
  Navbar,
  Nav,
  NavItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  NavbarBrand,
  NavbarToggler
} from 'reactstrap';
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../../utils/colors'
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles';
import RingLoader from "react-spinners/RingLoader";
import { validateEmail, validateUsername, validatePassword, validateString } from '../../utils/validators'

const styles = theme => ({
  fieldLabel: {
    color: ICE_BLUE,
    fontSize: 18,
    marginBottom: 0,
    marginTop: 15,
    marginLeft: '5%'
  },
  textField: {
    width: '90%',
    marginLeft: '5% !important',
    marginTop: '5% !important',
    "&:last-child": {
      marginTop: "0 !important",
    }
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
  errorMessage: {
    marginLeft: '5%',
    color: 'red',
    marginBottom: 0,
    marginTop: 2
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
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: '5%'
  },
  listItems: {
    fontSize: 14,
    marginLeft: 15
  },
  text: {
    color: ICE_BLUE
  }
})

class SignUpForm extends React.Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    showLoader: false,
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
      username: "",
      password: ""
    })
  }

  userAlreadyExists = (error) => {
    return error.status === 400
      && error.message.username
      && error.message.username.includes('A user with that username already exists.')
  }

  emailAlreadyExists = (error) => {
    return error.status === 400
      && error.message.email
      && error.message.email.includes('user with this email already exists.')
  }

  passwordTooShort = (error) => {
    return error.status === 400
      && error.message.password.includes('Password Must Be At Least 7 Characters')
  }

  disableButton = () => {
    const { username, password, first_name, last_name, email } = this.state
    return !validateString(first_name,1 ) || first_name === ""
    || !validateString(last_name, 1) || last_name === ""
    || !validateUsername(username, 5) || username === ""
    || !validateEmail(email) || email === ""
    || !validatePassword(password, 7) || password === ''
  }

  render() {
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

    const buttonDisabled = this.props.loadingSignUpRequest || this.disableButton();
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={classes.modal}>
        <ModalHeader toggle={this.props.toggle} className={classes.modalHeader}><p style={{ fontSize: 36, marginBottom: 0 }}>Sign Up</p></ModalHeader>
        {!this.props.loadingSignUpRequest ?
          <ModalBody className={classes.modalBody}>
            <TextField
              label={"First Name"}
              variant={"outlined"}
              onChange={(e) => this.handleChange(e, 'first_name')}
              value={this.state.first_name}
              inputProps={{ autocomplete: 'new-password' }}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              error={!validateString(this.state.first_name, 1)}
              helperText={!validateString(this.state.first_name, 1) ? "Must not be blank and contain only letters, spaces dashes aned/or periods" : null}
            />
            <TextField
              label={"Last Name"}
              variant={"outlined"}
              onChange={(e) => this.handleChange(e, 'last_name')}
              value={this.state.last_name}
              inputProps={{ autocomplete: 'new-password' }}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              error={!validateString(this.state.last_name, 1)}
              helperText={!validateString(this.state.last_name, 1) ? "Must not be blank and contain only letters, dashes, periods and/or spaces" : null}
            />
            <TextField
              label={"Email Address"}
              variant={"outlined"}
              onChange={(e) => {
                this.handleChange(e, 'email')
                if (this.emailAlreadyExists(this.props.error)) {
                  this.props.setError({
                    show: false,
                    code: null,
                    statusText: "",
                    message: []
                  })
                }
              }}
              value={this.state.email}
              inputProps={{ autocomplete: 'new-password' }}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              error={this.emailAlreadyExists(this.props.error) || !validateEmail(this.state.email)}
              helperText={this.emailAlreadyExists(this.props.error) ? this.props.error.message.email : !validateEmail(this.state.email) ? "Invalid Email" : null}

            />
            <TextField
              label={"Username"}
              variant={"outlined"}
              onChange={(e) => {
                this.handleChange(e, "username")
                if (this.userAlreadyExists(this.props.error)) {
                  this.props.setError({
                    show: false,
                    code: null,
                    statusText: "",
                    message: []
                  })
                }
              }}
              value={this.state.username}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              error={this.userAlreadyExists(this.props.error) || !validateUsername(this.state.username, 5)}
              helperText={this.userAlreadyExists(this.props.error) ? this.props.error.message.username : !validateUsername(this.state.username, 5) ? "Invalid Username" : null}
            />
            <h4 className={clsx(classes.text, classes.listHeader)}>{"Password Criteria:"}</h4>
            <ul>
              <li className={clsx(classes.text, classes.listItems)}>{"Must be at least 8 characters long"}</li>
              <li className={clsx(classes.text, classes.listItems)}>{" Allowed Characters are a-z, A-Z, 1-9 and !@#$%^&*()-_=+<,>./?"}</li>
            </ul>
            <TextField
              label={"Password"}
              variant={"outlined"}
              onChange={this.handleChangePassword}
              value={"*".repeat(this.state.password.length)}
              // inputProps={{ "boof": "password" }}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              error={this.passwordTooShort(this.props.error) || !validatePassword(this.state.password, 7)}
              helperText={this.passwordTooShort(this.props.error) ? this.props.error.message.password : !validatePassword(this.state.password) ? "Invalid Password" : null}
            />
          </ModalBody>
          :
          <RingLoader
            color={ICE_BLUE}
            loading={true}
            css={`margin: auto`}
            size={200}
          />
        }
        <ModalFooter className={classes.modalFooter}>
          <Button disabled={buttonDisabled} onClick={e => this.props.handleSignUp(e, this.state)} className={classes.button}>Submit</Button>
        </ModalFooter>
      </Modal>

    )
  }
}

export default withStyles(styles)(SignUpForm);


// LoginForm.propTypes = {
//   handleLogin: PropTypes.func.isRequired
// };
