import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Form,
    Input,
    InputGroup
} from 'reactstrap';

class SignUpForm extends React.Component {
    state = {
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
        <Form onSubmit={e => this.props.handleSignup(e, this.state)}>
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
        </Form>
      );
    }
}

export default SignUpForm;

SignUpForm.propTypes = {
    handleSignup: PropTypes.func.isRequired
}
