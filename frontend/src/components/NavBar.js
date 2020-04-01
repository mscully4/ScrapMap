import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
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
import { withRouter, Link } from 'react-router-dom';


import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const styles = {
  navbar: {
    backgroundColor: "#232323",
    color: "#d4dada"
  },
  title: {
    fontFamily: "Kaushan Script",
    fontSize: 36,
    color: "#0095d2",
  },
  username: {
    fontFamily: "Kaushan Script",
    fontSize: 24,
    margin: "auto",
    lineHeight: 'inherit'
  },
  button: {
    margin: '0 10px',
    backgroundColor: '#0095d2',
    width: 100,
    display: 'block',
  },
  addIcon: {
    height: 40,
    width: 40,
    cursor: 'pointer',
  },
  divider: {
    fontSize: 24,
    margin: 'auto 10px',
    lineHeight: 'inherit'
  },
  logout: {
    color: "#0095d2",
    fontSize: 24
  },
}

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleLogin: false,
      showLoginModal: false,
      showSignUpModal: false,

    }
  }

  toggleLogin = () => {
    this.setState(prevState => ({
      showLoginModal: !prevState.showLoginModal,
    }));
  }

  toggleSignUp = () => {
    this.setState(prevState => ({
      showSignUpModal: !prevState.showSignUpModal,
    }));
  }

  render() {
    //this.updateWindowDimensions();
    let form, username, submitForm, addCity;
    // console.log(this.props)
    if (this.props.loggedIn) {
      form =
        <Nav className="ml-auto" navbar>
          <NavItem>
            <h3 style={styles.username}> Hello, {this.props.username} </h3>
          </NavItem>
          <NavItem>
            <h3 style={styles.divider}> | </h3>
          </NavItem>
          <NavItem>
            {/* <Button className="nav-button" onClick={this.props.handleLogout}>Logout</Button> */}
            <Link style={styles.logout} onClick={this.props.handleLogout} to="/">Logout</Link>
          </NavItem>
        </Nav>
    } else {
      form =
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Button className="nav-button" style={styles.button} onClick={this.toggleLogin}>Login</Button>
            <Modal isOpen={this.state.showLoginModal} toggle={this.toggleLogin}>
              <ModalHeader toggle={this.toggleLogin}>Login</ModalHeader>
              <ModalBody>
                <LoginForm handleLogin={this.props.handleLogin} />
              </ModalBody>
            </Modal>
          </NavItem>
          <br />
          {this.props.handleSignup ?
            <NavItem>
              <Button className="nav-button" style={styles.button} onClick={this.toggleSignUp}>Sign Up</Button>
              <Modal isOpen={this.state.showSignUpModal} toggle={this.toggleSignUp}>
                <ModalHeader toggle={this.toggleSignUp}>Sign Up</ModalHeader>
                <ModalBody>
                  <SignUpForm handleSignup={this.props.handleSignup} />
                </ModalBody>
              </Modal>
            </NavItem> : null
          }
        </Nav>
    }
    return (
      <Navbar style={styles.navbar} expand="md">
        <NavbarBrand style={styles.title} className={styles.title} href="/">ScrapMap</NavbarBrand>
        <NavbarToggler />
        {form}
      </Navbar>
    )
  }
}


export default withRouter(Navigation);