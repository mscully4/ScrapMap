import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import {
    Button,
    Form,
    Input,
    InputGroup
} from 'reactstrap';

class LoginForm extends React.Component {
    state = {
        username: "",
        password: ""
    };

    handleChange = e => {
        const name = e.target.name;
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
      return (
        <Form ref={ref => this.formLogin = ref} onSubmit={e => this.props.handleLogin(e, this.state)}>
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
      )
    }
}

export default LoginForm;

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
};
