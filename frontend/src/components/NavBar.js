import React from 'react';
import PropTypes from 'prop-types';
import { Button,
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
    fontSize: 28,
    color: "#0095d2",
  },
  username: {
    fontFamily: "Kaushan Script",
    fontSize: 24,
    margin: "0 10px",
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
            <h3 style={{margin: "0 10px"}} className="nav-divider"> | </h3>
          </NavItem>
          <NavItem>
            {/* <Button className="nav-button" onClick={this.props.handleLogout}>Logout</Button> */}
            <Link onClick={this.props.handleLogout} to="/">Logout</Link>
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
                  <LoginForm handleLogin={this.props.handleLogin}/>
                </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </Modal>
          </NavItem>
          <br />
          <NavItem>
            <Button className="nav-button" style={styles.button} onClick={this.toggleSignUp}>Sign Up</Button>
            <Modal isOpen={this.state.showSignUpModal} toggle={this.toggleSignUp}>
              <ModalHeader toggle={this.toggleSignUp}>Sign Up</ModalHeader>
                <ModalBody>
                  <SignUpForm handleSignup={this.props.handleSignup}/>
                </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </Modal>
          </NavItem>
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