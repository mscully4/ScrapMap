import React from 'react';
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

class SignUpForm extends React.Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  };

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={classes.modal}>
        <ModalHeader toggle={this.props.toggle} className={classes.modalHeader}><p style={{ fontSize: 36, marginBottom: 0 }}>Login</p></ModalHeader>
        <ModalBody style={styles.modalBody} className={classes.modalBody}>
          {!this.props.loadingUserData ?
            <Form onSubmit={e => this.props.handleSignup(e, this.state)}>
              <p className={classes.fieldLabel}>First Name:</p>
              <Input
                type="text"
                boof="first_name"
                value={this.state.first_name}
                onChange={this.handleChange}
                autoComplete={"new-password"}
                className={clsx(this.props.classes.input)}
              />
              <p className={classes.fieldLabel}>Last Name:</p>
              <Input
                type="text"
                boof="last_name"
                value={this.state.last_name}
                onChange={this.handleChange}
                autoComplete={"new-password"}
                className={clsx(this.props.classes.input)}
              />
              <p className={classes.fieldLabel}>Email:</p>
              <Input
                type="text"
                boof="email"
                value={this.state.first_name}
                onChange={this.handleChange}
                autoComplete={"new-password"}
              />
              <Input
                type="text"
                name="username"
                placeholder="username"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <br />
              <Input
                type="text"
                name="password"
                placeholder="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
              <br />
              <Button type="submit">Submit</Button>
            </Form> : <div></div>}
        </ModalBody>
        <ModalFooter className={classes.modalFooter}>
          <Button disabled={this.props.loadingUserData} onClick={this.submitForm} className={classes.button}>Submit</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default SignUpForm;

SignUpForm.propTypes = {
  handleSignup: PropTypes.func.isRequired
}
