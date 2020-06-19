import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles';
import { Button, Form, Input } from 'reactstrap';
import TextField from '@material-ui/core/TextField';

import Navigation from '../components/NavBar'
import Error from '../components/Error.js'
import RingLoader from "react-spinners/RingLoader";
import { Redirect } from 'react-router-dom'
import { validateEmail, validatePassword, validateString, validateUsername } from '../utils/validators'
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../utils/colors'

const styles = theme => ({
  main: {
    backgroundColor: OFF_BLACK_1
  },
  modalContent: {
    border: 'none',
    height: '100%'
  },
  signUpText: {
    color: ICE_BLUE,
    fontSize: 36,
    marginBottom: 12
  },
  addSVG: {
    height: 100,
    width: 100
  },
  form: {
    marginLeft: '10%',
    marginTop: 50
  },
  button: {
    backgroundColor: ICE_BLUE,
    // marginLeft: '5%',
    marginTop: 20,
    width: 350
  },
  textField: {
    display: 'block',
    width: 350,
    marginTop: '2% !important'
  },
  input: {
    color: ICE_BLUE,
    width: '100%',
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
    marginBottom: 5
  },
  listItems: {
    fontSize: 14
  },
  text: {
    color: ICE_BLUE
  }
})

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",

      redirect: false
    }
  }

  handleChange = (e, name) => {
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

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

  submitForm = () => {
    ReactDOM.findDOMNode(this.formSignUp).dispatchEvent(new Event("submit"))
  }

  disableButton = () => {
    const { username, password, first_name, last_name, email } = this.state
    return !validateString(first_name,1 ) || first_name === ""
    || !validateString(last_name, 1) || last_name === ""
    || !validateUsername(username, 5) || username === ""
    || !validateEmail(email) || email === ""
    || !validatePassword(password, 7) || password === ''
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

  render() {
    const classes = this.props.classes
    if (this.state.redirect || this.props.loggedInUser) {
      return <Redirect to={this.props.loggedInUser} />
    }

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
      <div style={{ height: window.innerHeight }} className={clsx(classes.main)}>
        <Navigation
          loggedIn={this.props.loggedIn}
          username={this.props.username}
          context={"Home"}
          handleLogin={this.props.handlers.login}
          handleLogout={this.props.handlers.logout}
          handleSignUp={this.props.handlers.signUp}
          pendingRequestLogin={this.props.pendingRequests.login}
          pendingRequestSignUp={this.props.pendingRequests.signUp}
          signUpError={this.props.signUpError}
          error={this.props.error}
          setError={this.props.setError}
        />
        {!this.props.pendingRequests.login ?
          <Form
            ref={ref => this.formSignUp = ref}
            className={clsx(classes.form)}
            onSubmit={(e) => {
              this.props.handlers.signUp(e, this.state)
            }}
          >
            <p className={classes.signUpText}>Sign Up Now!</p>
            <TextField
              label={"First Name"}
              variant={"outlined"}
              onChange={(e) => this.handleChange(e, "first_name")}
              value={this.state.first_name}
              inputProps={{ "boof": "first_name", "autoComplete": 'new-password' }}
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
              inputProps={{ "boof": "last_name", "autoComplete": 'new-password' }}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              error={!validateString(this.state.last_name, 1)}
              helperText={!validateString(this.state.last_name, 1) ? "Must not be blank and contain only letters, dashes, periods and/or spaces" : null}
            />
            <TextField
              label={"Email"}
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
              inputProps={{ "autoComplete": 'new-password' }}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              error={this.emailAlreadyExists(this.props.error) || !validateEmail(this.state.email)}
              helperText={this.emailAlreadyExists(this.props.error) ? this.props.error.message.email : !validateEmail(this.state.email) ? "Invalid Email": null}
            />
            {this.props.signUpError ?
              <span style={{ color: 'red' }}>A user with that username already exists</span> : null}
            <TextField
              label={"Username"}
              variant={"outlined"}
              onChange={(e) => {
                this.handleChange(e, 'username')
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
              inputProps={{ "autoComplete": 'new-password' }}
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
              onChange={(e) => {
                this.handleChangePassword(e)
              }}
              value={"*".repeat(this.state.password.length)}
              inputProps={{ "autoComplete": 'new-password' }}
              InputProps={inputProps}
              InputLabelProps={InputLabelProps}
              className={classes.textField}
              error={this.passwordTooShort(this.props.error) || !validatePassword(this.state.password, 7)}
              helperText={this.passwordTooShort(this.props.error) ? this.props.error.message.password : !validatePassword(this.state.password) ? "Invalid Password" : null}
            />
            <Button disabled={this.disableButton() || this.props.loadingSignupRequest} className={clsx(classes.button)} onClick={this.submitForm}>Submit</Button>
          </Form> :
          <RingLoader
            color={ICE_BLUE}
            loading={true}
            css={`margin: auto; top: ${(window.innerHeight - 500) / 2.5}px`}
            size={500}
          />}
        {this.props.error.show ?
          <Error
            isOpen={this.props.error.show}
            error={this.props.error}
          /> : null}
      </div>
    )
  }
}

export default withStyles(styles)(Home);