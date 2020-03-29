import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from "react-photo-gallery";
import { Modal } from 'reactstrap';
import clsx from 'clsx'
import { withStyles} from '@material-ui/styles';
import Carousel, { ModalGateway } from 'react-images';
import { Button, Form, Input} from 'reactstrap';

import Map from '../components/Map';
import Table from '../components/Table'
import ImageViewer from '../components/ImageViewer';
import Navigation from '../components/NavBar'
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
    width: "30%",
    backgroundColor: "#232323",
    border: "solid 1px #0095d2",
    color: "#0095d2",
  },
  button: {
    backgroundColor: "#0095d2",
    // marginLeft: '5%',
    marginTop: 20,
    width: "30%"
  }
})

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
    }
  }

  handleChange = e => {
    const name = e.target.name;
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

  render() {
    const classes = this.props.classes
    return (
      <div style={{ height: window.innerHeight }} className={clsx(classes.main)}>
        <Navigation
          loggedIn={this.props.loggedIn}
          username={this.props.username}
          handleLogout={this.props.handleLogout}
          toggleLogin={this.props.toggleLogin}
          toggleSignUp={this.props.toggleSignUp}
          handleLogin={this.props.handleLogin}
          handleSignup={this.props.handleSignup}
        />
        <Form ref={ref => this.formSignUp = ref} className={clsx(classes.form)} onSubmit={(e) => this.props.handleSignup(e, this.state)}>
          <p 
          style={{
            color: "#0095d2",
            fontSize: 36,
            marginBottom: 12
          }}
          >
            Sign Up Now!
          </p>
          <Input
            type="text"
            name="username"
            placeholder={"Username"}
            className={clsx(classes.input)}
            autoComplete={"new-password"}
            value={this.state.username}
            onChange={this.handleChange}
          />
          <br />
          <Input
            type="text"
            name="password"
            placeholder={"Password"}
            className={clsx(classes.input)}
            autoComplete={"new-password"}
            value={this.state.password}
            onChange={this.handleChange}
          />
        <Button className={clsx(classes.button)} onClick={this.submitForm}>Submit</Button>

        </Form>

      </div>
    ) 
  }
}

export default withStyles(styles)(Home);