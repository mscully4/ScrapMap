import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from "react-photo-gallery";
import { Modal } from 'reactstrap';
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles';
import Carousel, { ModalGateway } from 'react-images';
import { Button, Form, Input } from 'reactstrap';

import ImageViewer from '../components/Images/ImageViewer';
import Navigation from '../components/NavBar'
import RingLoader from "react-spinners/RingLoader";
import { Redirect } from 'react-router-dom'

import { Add1, Add2 } from '../utils/SVGs';
import { getUser } from '../utils/fetchUtils';

const styles = theme => ({
  main: {
    backgroundColor: "#1a1a1a"
  },
  modalContent: {
    border: 'none',
    height: '100%'
  },
  addSVG: {
    height: 100,
    width: 100
  },
  form: {
    marginLeft: '10%',
    marginTop: 50
  },
  input: {
    width: 350,
    backgroundColor: "#232323",
    border: "solid 1px #0095d2",
    color: "#0095d2",
    "&:focus": {
      backgroundColor: "#292929",
      color: "#0095d2",
    }
  },
  button: {
    backgroundColor: "#0095d2",
    // marginLeft: '5%',
    marginTop: 20,
    width: 350
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

  handleChange = e => {
    const name = e.target.getAttribute("boof");
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

  submitForm = () => {
    ReactDOM.findDOMNode(this.formSignUp).dispatchEvent(new Event("submit"))
  }

  disableButton = () => {
    const {username, password, first_name, last_name, email} = this.state
    return !(username !== "" && password !== "" && first_name !== "" && last_name !== "" && email !== "")
  }

  render() {
    const classes = this.props.classes
    console.log(this.state.redirect, this.props)
    if (this.state.redirect || this.props.loggedInUser) {
      return <Redirect to={this.props.loggedInUser} />
    }

    return (
      <div style={{ height: window.innerHeight }} className={clsx(classes.main)}>
        <Navigation
          loggedIn={this.props.loggedIn}
          username={this.props.username}
          handleLogout={this.props.handleLogout}
          toggleLogin={this.props.toggleLogin}
          toggleSignUp={this.props.toggleSignUp}
          handleLogin={this.props.handleLogin}
          handleSignup={null}
          loadingUserData={this.props.loadingUserData}
        />
        { !this.props.loadingSignupRequest ? 
        <Form 
          ref={ref => this.formSignUp = ref} 
          className={clsx(classes.form)} 
          onSubmit={(e) => {
            this.props.handleSignup(e, this.state)
            this.setState({
              redirect: true
            })
          }
          }>
          <p
            style={{
              color: "#0095d2",
              fontSize: 36,
              marginBottom: 12
            }}>Sign Up Now!</p>
          <Input
            type="text"
            boof="first_name"
            placeholder={"First Name"}
            className={clsx(classes.input)}
            value={this.state.first_name}
            onChange={this.handleChange}
            autoComplete={"new-password"}
          />
          <br />
          <Input
            type="text"
            boof="last_name"
            placeholder={"Last Name"}
            className={clsx(classes.input)}
            autoComplete={"new-password"}
            value={this.state.last_name}
            onChange={this.handleChange}
          />
          <br />
          <Input
            type="text"
            boof="email"
            placeholder={"Email"}
            className={clsx(classes.input)}
            value={this.state.email}
            onChange={this.handleChange}
            autoComplete={"new-password"}
          />
          <br />
          <Input
            type="text"
            boof="username"
            placeholder={"Username"}
            className={clsx(classes.input)}
            value={this.state.username}
            onChange={this.handleChange}
            autoComplete={"new-password"}
          />
          <br />
          <Input
            type="password"
            boof="password"
            placeholder={"Password"}
            className={clsx(classes.input)}
            autoComplete={"new-password"}
            value={this.state.password}
            onChange={this.handleChange}
          />
          <Button disabled={this.disableButton() || this.props.loadingSignupRequest} className={clsx(classes.button)} onClick={this.submitForm}>Submit</Button>
        </Form> : 
         <RingLoader
         color={"#0095d2"}
         loading={true}
         css={`margin: auto; top: ${(window.innerHeight - 500) / 2.5}px`}
         size={500}
       />}

      </div>
    )
  }
}

export default withStyles(styles)(Home);