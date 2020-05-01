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
import clsx from 'clsx'
import { Svg, home } from '../utils/SVGs';

import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../utils/colors'
import { withRouter, Link } from 'react-router-dom';


import LoginForm from './Forms/LoginForm';
import SignUpForm from './Forms/SignUpForm';

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
    // fontFamily: "Kaushan Script",
    fontSize: 24,
    margin: "auto",
    lineHeight: 'inherit',
    color: "#f8f8ff",
    fontWeight: 'unset'
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
  home: {
    width: 32,
    height: 32,
    cursor: 'pointer',
    margin: "0 15"
  }
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
    let content;
    if (this.props.loggedIn) {
      content =
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link to={`${this.props.username}`}>
              <Svg viewbox={home.viewBox} style={styles.home}>
                {home.path.map((el, i) => <path key={`${i}`} d={el} stroke={ICE_BLUE} fill={ICE_BLUE} />)}
              </Svg>
            </Link>
          </NavItem>
          <NavItem>
            <h3 style={styles.username}> Hello, {this.props.username} </h3>
          </NavItem>
          <NavItem>
            <h3 style={styles.divider}> | </h3>
          </NavItem>
          <NavItem>
            <Link style={styles.logout} onClick={this.props.handleLogout} to="/">Logout</Link>
          </NavItem>
        </Nav>
    } else {
      content =
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Button className="nav-button" style={styles.button} onClick={this.toggleLogin}>Login</Button>
            <LoginForm
              handleLogin={this.props.handleLogin}
              isOpen={this.state.showLoginModal}
              toggle={this.toggleLogin}
              style={styles.modal}
              loadingUserData={this.props.loadingUserData}
            />
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
        <NavbarBrand style={styles.title}>ScrapMap</NavbarBrand>
        <NavbarToggler />
        {content}
      </Navbar>
    )
  }
}


export default withRouter(Navigation);