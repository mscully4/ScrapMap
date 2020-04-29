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
  input: {
    width: '90%',
    margin: 'auto',
    backgroundColor: OFF_BLACK_2,
    border: `solid 1px ${ICE_BLUE}`,
    color: ICE_BLUE,
    "&:focus": {
      backgroundColor: OFF_BLACK_3,
      color: ICE_BLUE,
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
  }
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

  submitForm = () => {
    ReactDOM.findDOMNode(this.formLogin).dispatchEvent(new Event("submit"))
  }

  render() {
    const classes = this.props.classes
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={classes.modal}>
        <ModalHeader toggle={this.props.toggle} className={classes.modalHeader}><p style={{fontSize:36, marginBottom: 0}}>Login</p></ModalHeader>
        <ModalBody style={styles.modalBody} className={classes.modalBody}>
          {!this.props.loadingUserData ?
            <Form ref={ref => this.formLogin = ref} onSubmit={e => this.props.handleLogin(e, this.state)}>
              <p className={classes.fieldLabel}>Username:</p>
              <Input
                type="text"
                boof="username"
                value={this.state.username}
                onChange={this.handleChange}
                autoComplete={"new-password"}
                className={clsx(this.props.classes.input)}
              />
              <p className={classes.fieldLabel}>Password:</p>
              <Input
                type="password"
                boof="password"
                value={this.state.password}
                onChange={this.handleChange}
                autoComplete={"new-password"}
                className={clsx(this.props.classes.input)}
              />
              <br />
            </Form> :
            <RingLoader
              color={"#0095d2"}
              loading={true}
              css={`margin: auto`}
              size={200}
            />}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button disabled={this.props.loadingUserData} onClick={this.submitForm} className={classes.button}>Submit</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default withStyles(styles)(LoginForm);


LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
};
