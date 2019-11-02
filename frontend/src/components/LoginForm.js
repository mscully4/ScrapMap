import React from 'react';
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

    handle_change = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevState => {
            const newState = { ...prevState };
            newState[name] = value;
            return newState;
        })
    }

    render() {
      return (
        <Form onSubmit={e => this.props.handle_login(e, this.state)}>
          <Input
            type="text"
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={this.handle_change}
          />
          <br />
          <Input
            type="text"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handle_change}
          />
          <br />
          <Button type="submit" >Submit</Button>
        </Form>
      )
    }
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired
};
