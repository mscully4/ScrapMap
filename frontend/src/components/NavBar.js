import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from 'reactstrap';
import { withStyles } from '@material-ui/styles';

import clsx from 'clsx'
import { searchUsers } from '../utils/fetchUtils';
import { Svg, home } from '../utils/SVGs';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../utils/colors'
import { withRouter, Link } from 'react-router-dom';


import LoginForm from './Forms/LoginForm';
import SignUpForm from './Forms/SignUpForm';

const styles = theme => ({
  navigationBar: {
    backgroundColor: OFF_BLACK_2,
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr 3fr 2fr',
    alignItems: 'center'
  },
  logo: {
    fontFamily: "Kaushan Script",
    fontSize: 36,
    color: "#0095d2",
    marginLeft: '10%'
  },
  searchBar: {
    width: '80%',
    margin: 'auto'
  },
  searchBarInput: {
    color: ICE_BLUE
  },
  searchBarLabel: {
    color: `${ICE_BLUE} !important`
  },
  searchBarBorder: {
    borderWidth: '1px',
    borderColor: `${ICE_BLUE} !important`
  },
  searchBarOptions: {
    color: ICE_BLUE,
    width: '100%',
    height: '100%',
    '&[data-focus="true"]': {
      backgroundColor: `${ICE_BLUE} !important`,
      '& div': {
        color: `${OFF_BLACK_1} !important`,
      }
    },
  },
  listbox: {
    backgroundColor: OFF_BLACK_1,
    border: `solid 1px ${ICE_BLUE}`,
    borderRadius: 5
  },
  userInfo: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '3fr auto 40px auto',
    alignItems: 'center',
  },
  username: {
    // fontFamily: "Kaushan Script",
    fontSize: '150%',
    margin: "auto",
    lineHeight: 'inherit',
    color: FONT_GREY,
    fontWeight: 'unset',
  },
  divider: {
    fontSize: '150%',
    margin: 'auto',
    color: FONT_GREY
  },
  logout: {
    color: "#0095d2",
    fontSize: '150%',
    textAlign: 'left',
    paddingRight: 50
  },
  homeIcon: {
    width: 32,
    height: 32,
    cursor: 'pointer',
    marginRight: 20,
    float: 'right',
  },
  actionButtons: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr 1fr'
  },
  button: {
    backgroundColor: '#0095d2',
    width: '50%',
    display: 'block',
    margin: 'auto'
  }
})

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleLogin: false,
      showLoginModal: false,
      showSignUpModal: false,

      searchValue: "",
      searchSuggestionsOpen: false,
      suggestions: []

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

  onInputChange = (e, obj, reason) => {
    //There is a glitch that will run this function again when the input box is cleared
    if (reason !== 'reset') {
      //only search for users when the search bar isn't empty
      if (obj !== "") {
        //TODO debounce this
        searchUsers(obj)
          .then(response => {
            this.setState({
              searchSuggestionsOpen: true,
              suggestions: response,
              searchValue: obj
            })
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.setState({
          searchSuggestionsOpen: false,
          suggestions: [],
          searchValue: obj
        })
      }
    }
  }

  onChange = (e, option, reason) => {
    if (reason !== 'clear') {
      this.setState({
        searchSuggestionsOpen: false,
        suggestions: [],
        searchValue: ""
      }, () => {
        this.props.history.push(`/${option.username}`)
      })
    }
  }



  render() {
    const classes = this.props.classes
    return (
      <div className={clsx(classes.navigationBar)} >
        <span className={clsx(classes.logo)}>ScrapMap</span>
        <Autocomplete
          id="free-solo-demo"
          className={clsx(classes.searchBar)}
          freeSolo
          key={this.state.randomKey}
          open={this.state.searchSuggestionsOpen}
          options={this.state.suggestions}
          filterOptions={(props, state) => {
            //the filtering is done on the backend by django
            return props
          }}
          getOptionLabel={(option) => option.username}
          onChange={this.onChange}
          inputValue={this.state.searchValue}
          onInputChange={this.onInputChange}
          renderOption={(option, state) => {
            return <div className={clsx(classes.searchBarOptions)}>{`${option.username}`}</div>
          }}
          classes={{
            option: classes.searchBarOptions,
            listbox: classes.listbox
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search Users" margin="normal" variant="outlined"
              value={this.state.searchValue}
              InputProps={{
                ...params.InputProps,
                className: clsx(this.props.classes.searchBarInput),
                classes: {
                  notchedOutline: clsx(classes.searchBarBorder),
                }
              }}
              InputLabelProps={{
                className: clsx(classes.searchBarLabel),
              }}
            />
          )}
        />
        {this.props.loggedIn && this.props.loggedInUserDataLoaded ?
          <div className={clsx(classes.userInfo)}>
            <Link to={`${this.props.loggedInUser}`}>
              <Svg viewbox={home.viewBox} className={clsx(classes.homeIcon)} /*onClick={this.props.recenter}*/>
                {home.path.map((el, i) => <path key={`${i}`} d={el} stroke={ICE_BLUE} fill={ICE_BLUE} />)}
              </Svg>
            </Link>
            <h3 className={clsx(classes.username)}> {`Hello, ${this.props.loggedInUser}`} </h3>
            <h3 className={clsx(classes.divider)}> | </h3>
            <Link className={clsx(classes.logout)} onClick={this.props.handleLogout} to="/">Logout</Link>
          </div>
          :
          <div className={clsx(classes.actionButtons)}>
            <div></div>
            <Button className={clsx(classes.button)} style={{ marginRight: 15 }} onClick={this.toggleLogin}>Login</Button>
            <LoginForm
              handleLogin={this.props.handleLogin}
              isOpen={this.state.showLoginModal}
              toggle={this.toggleLogin}
              loadingUserData={this.props.loadingUserData}
            />
            {/* <Button className={clsx(classes.button)} style={{ marginLeft: 15 }} onClick={this.toggleSignUp}>Sign Up</Button>
            <SignUpForm
              handleSignUp={this.props.handleSignUp}
              isOpen={this.state.showSignUpModal}
              toggle={this.toggleSignUp}
              loadingSignUpRequest={this.props.loadingSignUpRequest}
              signUpError={this.props.signUpError}
            /> */}
          </div>}
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Navigation));