import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Input,
} from 'reactstrap';
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles';
import { ICE_BLUE } from "../utils/colors"


const styles = theme => ({
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
})

class LoginForm extends React.Component {
  state = {
    username: "",
    password: ""
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

  render() {
    return (
      <Form ref={ref => this.formLogin = ref} onSubmit={e => this.props.handleLogin(e, this.state)}>
        <Input
          type="text"
          boof="username"
          placeholder="Username"
          value={this.state.username}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          className={clsx(this.props.classes.input)}
        />
        <br />
        <Input
          type="password"
          boof="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handleChange}
          autoComplete={"new-password"}
          className={clsx(this.props.classes.input)}
        />
        <br />
        <Button disabled={false} type="submit" style={{backgroundColor: ICE_BLUE}}>Submit</Button>
      </Form>
    )
  }
}

export default withStyles(styles)(LoginForm);


LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
};
