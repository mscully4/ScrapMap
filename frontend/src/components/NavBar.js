import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx'
import { searchUsersDebounced } from '../utils/fetchUtils';
import { Svg, home } from '../utils/SVGs';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withRouter, Link } from 'react-router-dom';

import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../utils/colors'
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
    color: ICE_BLUE,
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
    gridTemplateColumns: '3fr auto 30px auto',
    alignItems: 'center',
  },
  username: {
    // fontFamily: "Kaushan Script",
    fontSize: 20,
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
    color: ICE_BLUE,
    fontSize: 20,
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
    backgroundColor: ICE_BLUE,
    width: '60%',
    display: 'block',
    margin: 'auto'
  }
})

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    //There is a glitch that will run this function again when the input box is cleared, this if prevents that
    if (reason !== 'reset') {
      //only search for users when the search bar isn't empty
      if (obj !== "") {
        this.setState({
          searchValue: obj
        })
        searchUsersDebounced(obj)
          .then(response => {
            //There is an issue with the body stream being read more than once due to debouncing, cloning provides a workaround
            const copy = response.clone()
            copy.json()
              .then(json => {
                this.setState({
                  searchSuggestionsOpen: true,
                  suggestions: json,
                })
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
    if (reason !== 'clear' && reason !== 'create-option') {
      this.setState({
        searchSuggestionsOpen: false,
        suggestions: [],
        searchValue: ""
      }, () => {
        //go to the selected user's page
        this.props.history.push(`/${option.username}`)
      })
    }
  }

  render() {
    const classes = this.props.classes

    const signUpButton = this.props.context === "Main" ?
      <Button className={clsx(classes.button)} style={{ marginRight: 15 }} onClick={this.toggleSignUp}>Sign Up</Button>
      : <div></div>;

    return (
      <div className={clsx(classes.navigationBar)} >
        <span className={clsx(classes.logo)}>ScrapMap</span>
        <Autocomplete
          className={clsx(classes.searchBar)}
          freeSolo
          key={this.state.randomKey}
          open={this.state.searchSuggestionsOpen}
          options={this.state.suggestions}
          filterOptions={(props, state) => {
            //Most of the filtering is done by the backend, just need to exlude the user currently logged in from search results
            return props.filter(el => el.username !== this.props.loggedInUser)
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
        {/* If the user is signed in and his/her data is loaded, then show the username with the logout button */}
        {/* Otherwise show the login/signup buttons.  The signup button is shown on Main but not Home */}
        {this.props.loggedIn && this.props.loggedInUserDataLoaded ?
          <div className={clsx(classes.userInfo)}>
            <Link to={`${this.props.loggedInUser}`}>
              <Svg viewbox={home.viewBox} className={clsx(classes.homeIcon)}>
                {home.path.map((el, i) => <path key={`${i}`} d={el} stroke={ICE_BLUE} fill={ICE_BLUE} />)}
              </Svg>
            </Link>
            <h3 className={clsx(classes.username)}> {`Hello, ${this.props.loggedInUser}`} </h3>
            <h3 className={clsx(classes.divider)}> | </h3>
            <Link className={clsx(classes.logout)} onClick={this.props.handleLogout} to="/">Logout</Link>
          </div>
          :
          <div className={clsx(classes.actionButtons)}>
            {signUpButton}
            <SignUpForm
              handleSignUp={this.props.handleSignUp}
              isOpen={this.state.showSignUpModal}
              toggle={this.toggleSignUp}
              loadingSignUpRequest={this.props.pendingSignUpRequest}
              signUpError={this.props.signUpError}
              error={this.props.error}
              setError={this.props.setError}
            />

            <Button className={clsx(classes.button)} style={{ marginLeft: 15 }} onClick={this.toggleLogin}>Login</Button>
            <LoginForm
              handleLogin={this.props.handleLogin}
              isOpen={this.state.showLoginModal}
              toggle={this.toggleLogin}
              loadingUserData={this.props.pendingLoginRequest}
              error={this.props.error}
              setError={this.props.setError}
            />
          </div>}
      </div>
    )
  }
}

Navigation.propTypes = {
  handleLogin: PropTypes.func,
  handleSignUp: PropTypes.func,
  handleLogout: PropTypes.func,
  loadingUserData: PropTypes.bool,
  error: PropTypes.object,
  setError: PropTypes.func,
  context: PropTypes.string,
  loggedIn: PropTypes.bool,
  loggedInUser: PropTypes.string,
  loggedInUserData: PropTypes.object,
  history: PropTypes.object,
  viewUser: PropTypes.object,
  pendingLoginRequest: PropTypes.bool,
  pendingSignUpRequest: PropTypes.bool,
}

export default withRouter(withStyles(styles)(Navigation));