import React from 'react';
import PropTypes from 'prop-types';
//TODO replace this with custom code
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ICE_BLUE, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4, FONT_GREY } from '../../utils/colors';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx'
import { validateString } from '../../utils/validators'
var debounce = require('debounce-promise')

const styles = theme => ({
  textField: {
    width: '90%',
    marginLeft: '5% !important',
    marginTop: '2.5% !important'
  },
  input: {
    color: ICE_BLUE,
  },
  inputLabel: {
    color: `${ICE_BLUE} !important`
  },
  inputBorder: {
    borderWidth: '1px',
    borderColor: `${ICE_BLUE} !important`
  },
  autocompleteOptions: {
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
    backgroundColor: OFF_BLACK_2,
    border: `solid 1px ${ICE_BLUE}`,
    borderRadius: 5,
    "& li": {
      borderBottom: 'solid 1px #333'
    },
    "& li:first-child": {
      borderTop: 'solid 1px #333'
    }
  },
})

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      searchValue: ""
    };

    this.myRef = React.createRef();
    this.getPlaceSuggestionsDebounced = debounce(this.getPlaceSuggestions, 500)
    this.getCitySuggestionsDebounced = debounce(this.getCitySuggestions, 500)

  }

  componentDidMount = () => {
    this.props.clearSuggestionsHook(this.clearSuggestions)
    if (this.props.clearInputHook) {
      this.props.clearInputHook(this.clearInput)
    }
  }

  clearSuggestions = () => {
    this.setState({
      suggestions: []
    })
  }

  clearInput = () => {
    this.setState({
      searchValue: ""
    })
  }

  getCitySuggestions = (input) => {
    const autocomplete = new window.google.maps.places.AutocompleteService()
    const requestParameters = {
      input: input,
      types: ['(cities)'],
    }

    autocomplete.getPlacePredictions(requestParameters,
      (suggestions, status) => {
        if (status === 'OK') {
          this.setState({
            suggestions: suggestions
          })
        }
      })
  }

  getPlaceSuggestions = (input) => {
    const autocomplete = new window.google.maps.places.AutocompleteService()
    const requestParameters = {
      input: input,
      types: ['establishment'],
      radius: this.props.searchRadius,
      location: new window.google.maps.LatLng(this.props.location.lat, this.props.location.lng)
    }

    autocomplete.getPlacePredictions(requestParameters,
      (suggestions, status) => {
        if (status === 'OK') {
          this.setState({
            suggestions: suggestions
          })
        }
      })
  }

  onInputChange = (e, obj, reason) => {
    //update the input value
    if (reason !== 'reset') {
      this.setState({
        searchValue: obj
      })
    }

    //Only pull suggestions when the search string isn't empty and the user didn't clear the field
    if (obj !== "" && reason !== 'reset') {
      switch (this.props.context) {
        case "Place":
          this.getPlaceSuggestionsDebounced(obj)
          break;
        case "City":
          this.getCitySuggestionsDebounced(obj)
          break
      }
    } else {
      this.setState({
        suggestions: []
      })
    }
  }

  onChangeCity = (e, option, reason) => {
    //This function will get run if the text box is cleared, so need to make sure a selection was actually made
    if (option) {
      //Update state to reflect the selection
      const city = option.terms[0].value
      this.setState({
        searchValue: city
      })
      this.props.handleAutoCompleteChange(city)

      //Get additional data on the selection
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ placeId: option.place_id }, (results, status) => {
        if (status === "OK") {
          var state, latitude, longitude, countryCode, country;
          latitude = results[0].geometry.location.lat().toFixed(4)
          longitude = results[0].geometry.location.lng().toFixed(4)
          results[0].address_components.forEach((el, i) => {
            if (el.types.includes("administrative_area_level_1")) {
              state = el.long_name
            } else if (el.types.includes('country')) {
              country = el.long_name
              countryCode = el.short_name
            }
          })
          this.props.selectAutoSuggest({ city, country, latitude, longitude, countryCode, state })
        }
      })
    }
  }

  onChangePlace = (e, option, reason) => {
    if (option) {
      const name = option.structured_formatting.main_text
      //Update the search value
      this.setState({
        searchValue: name
      })
      //Send the place name back to the form
      this.props.handleAutoCompleteChange(name)

      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ placeId: option.place_id }, (results, status) => {
        if (status === 'OK') {
          var street_number = "", street = "", county = "", city = "", state = "", zip_code = "", country = "", address = "", countryCode = "";
          results[0].address_components.forEach(el => {
            if (el.types.includes("street_number")) street_number = el.long_name;
            else if (el.types.includes("route")) street = el.long_name;
            else if (el.types.includes("sublocality")) county = el.long_name;
            else if (el.types.includes("locality")) city = el.long_name;
            else if (el.types.includes("administrative_area_level_1")) state = el.long_name;
            else if (el.types.includes("administrative_area_level_2")) county = el.long_name
            else if (el.types.includes("country")) {
              country = el.long_name;
              countryCode = el.short_name === "US" ? "US" : el.short_name;
            }
            else if (el.types.includes("postal_code")) zip_code = el.long_name;
          });
          const latitude = parseFloat(results[0].geometry.location.lat().toFixed(4));
          const longitude = parseFloat(results[0].geometry.location.lng().toFixed(4));
          const placeId = results[0].place_id
          const types = results[0].types.join(",")
           //Establishment is the default type for all results, search for a more meaningful one
           var main_type = "establishment";
           for (var i = 0; i < this.props.placeTypes.length; ++i) {
             if (results[0].types.includes(this.props.placeTypes[i])) {
               main_type = this.props.placeTypes[i];
               break
             }
           }
           //Change the main type on the form
           this.props.changeMainType(main_type)
           address = street_number + " " + street
           //Send the location information back to the form, the fields will be filled with this information
           this.props.selectAutoSuggest({ name, address, city, state, country, countryCode, county, zip_code, types, placeId, latitude, longitude })
        }
      })
    }
  }

  render = () => {
    const classes = this.props.classes

    const error = this.props.context === "City" ? !validateString(this.state.searchValue, 120) : this.state.searchValue.length > 120
    const helperText = this.props.context === "City" ? "Must be shorter than 120 characters and contain only alphabetical characters" : "Must be less than 120 characters"
    return (
      <Autocomplete
        freeSolo
        key={this.state.randomKey}
        options={this.state.suggestions}
        getOptionLabel={(option) => option.description}
        onChange={this.props.context === "City" ? this.onChangeCity : this.onChangePlace}
        inputValue={this.state.searchValue}
        onInputChange={this.onInputChange}
        //The component will automatically filter some options out if this isn't specified
        filterOptions={(options, state) => options}
        renderOption={(option, state) => {
          return <div className={clsx(classes.autocompleteOptions)}>{`${this.props.context === 'City' ? option.description : option.structured_formatting.main_text}`}</div>
        }}
        classes={{
          option: classes.autocompleteOptions,
          listbox: classes.listbox
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={this.props.context}
            variant="outlined"
            value={this.state.searchValue}
            className={clsx(classes.textField)}
            inputProps={{ ...params.inputProps, autoComplete: 'new-password' }}
            InputProps={{
              ...params.InputProps,
              className: clsx(classes.input),
              classes: {
                notchedOutline: clsx(classes.inputBorder),
              }
            }}
            InputLabelProps={{
              className: clsx(classes.inputLabel),
            }}
            helperText={error ? helperText : null}
            error={error}
          />
        )}
      />)
  }
}

AutoComplete.propTypes = {
  context: PropTypes.string,
  selectAutoSuggest: PropTypes.func,
  clearSuggestionsHook: PropTypes.func,
  setError: PropTypes.func,
  handleAutoCompleteChange: PropTypes.func
}

export default withStyles(styles)(AutoComplete);