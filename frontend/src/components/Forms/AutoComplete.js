import React from 'react';
//TODO replace this with custom code
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
// If you want to use the provided css
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ICE_BLUE, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4, FONT_GREY } from '../../utils/colors';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx'
import { validateString } from '../../utils/validators'
var debounce = require('debounce-promise')

const placeURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?"
const cityURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&"

const styles = theme => ({
  dropdownItem: {
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: ICE_BLUE,
    padding: "5px 0",
    paddingLeft: 5,
    cursor: 'pointer'
  },
  dropdownItemHighlighted: {
    backgroundColor: ICE_BLUE,
    color: FONT_GREY
  },
  inputStyle: {
    backgroundColor: OFF_BLACK_4,
    color: ICE_BLUE,
    borderColor: ICE_BLUE,
    "&:focus": {
      backgroundColor: OFF_BLACK_4,
      color: ICE_BLUE,
      borderColor: ICE_BLUE,
    }
  },
  textField: {
    width: '90%',
    marginLeft: '5% !important',
    marginTop: '5% !important'
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
  selectDropdown: {
    color: `${ICE_BLUE} !important`
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
      listIndex: null,
      suggestions: [],
      apiKey: "AIzaSyBpXqyXMWAbXFs6XCxkMUFX09ZuHzjpKHU",
      value: "",
      menuOpen: false,

      suggestionsOpen: false,
      searchValue: ""
    };

    this.myRef = React.createRef();
    // this.loadPlaceSuggestionsDebounced = debounce(this.loadPlaceSuggestions, 500)
    // this.loadCitySuggestionsDebounced = debounce(this.loadCitySuggestions, 500)

  }

  componentDidMount = () => {
    this.props.clearSuggestionsHook(this.clearSuggestions)
  }

  clearSuggestions = () => {
    this.setState({
      suggestions: []
    })
  }
/*
  loadPlaceSuggestions = (input) => {
    const parameters = `input=${input}&location=${this.props.location.lat},${this.props.location.lng}&radius=${this.props.searchRadius}&key=${this.state.apiKey}${this.props.strictBounds ? "&strictbounds" : ""}`
    return fetch(placeURL + parameters, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  loadCitySuggestions = (input) => {
    const parameters = `input=${input}&key=${this.state.apiKey}`
    return fetch(cityURL + parameters, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
*/
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
    if (reason !== 'reset') {
      this.setState({
        searchValue: obj
      })
    }

    if (obj !== "" && reason !== 'reset') {
      switch (this.props.context) {
        case "Place":
          this.getPlaceSuggestions(obj)
          // this.loadPlaceSuggestionsDebounced(obj)
          //   .then(resp => {
          //     const response = resp.clone()
          //     if (!response.ok) {
          //       this.props.setError(true, response.statusText)
          //       throw Error(response.statusText)
          //     }
          //     return response.json()
          //   })
          //   .then(json => {
          //     //Only want predictions that have addresses
          //     var predictions = json.predictions.filter((pred) => pred.types.includes("establishment") ? true : false);
          //     this.setState({
          //       suggestions: predictions
          //     })
          //   })
          //   .catch(err => console.log(err))
          break;
        case "City":
          this.getCitySuggestions(obj)
          // this.loadCitySuggestionsDebounced(obj)
          //   .then(resp => {
          //     const response = resp.clone()
          //     if (!response.ok) {
          //       this.props.setError(true, response.statusText)
          //       throw Error(response.statusText)
          //     }
          //     return response.json()
          //   })
          //   .then(json => this.setState({ suggestions: json.predictions }))
          //   .catch(err => console.log(err))
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
      this.props.handleAutoCompleteChangeCity(city)

      const country = option.terms[option.terms.length - 1].value;
      geocodeByPlaceId(option.place_id).then((data) => {
        let state, latitude, longitude, countryCode;
        let address;
        for (var i = 0; i < data[0].address_components.length; ++i) {
          address = data[0].address_components[i];

          state = address.long_name === "United States" ? data[0].address_components[i - 1].long_name : state;
          latitude = parseFloat(data[0].geometry.location.lat().toFixed(4));
          longitude = parseFloat(data[0].geometry.location.lng().toFixed(4));
          countryCode = address.types && address.types.includes('country') ? address.short_name.toLowerCase() : countryCode
        }
        this.props.selectAutoSuggestCity({ city, country, latitude, longitude, countryCode, state })
      })
    }
  }

  onChangePlace = (e, option, reason) => {
    //Dont know if this if is needed
    if (option.place_id !== "") {
      const place_id = option.place_id
      const name = option.terms[0].value
      this.setState({
        searchValue: name
      })
      this.props.handleAutoCompleteChangePlace(name)
      geocodeByPlaceId(place_id)
        .then(data => {
          var street_number = "", street = "", county = "", city = "", state = "", zip = "", country = "", address = "", countryCode = "";
          data[0].address_components.forEach(element => {
            if (element.types.includes("street_number")) street_number = element.long_name;
            else if (element.types.includes("route")) street = element.long_name;
            else if (element.types.includes("sublocality")) county = element.long_name;
            else if (element.types.includes("locality")) city = element.long_name;
            else if (element.types.includes("administrative_area_level_1")) state = element.long_name;
            else if (element.types.includes("administrative_area_level_2")) county = element.long_name
            else if (element.types.includes("country")) {
              country = element.long_name;
              countryCode = element.short_name === "US" ? "US" : element.short_name;
            }
            else if (element.types.includes("postal_code")) zip = element.long_name;
          });
          const latitude = parseFloat(data[0].geometry.location.lat().toFixed(4));
          const longitude = parseFloat(data[0].geometry.location.lng().toFixed(4));
          const placeId = data[0].place_id
          const types = data[0].types.join(",")
          //Establishment is the default type for all results
          var main_type = "establishment";
          for (var i = 0; i < this.props.placeTypes.length; ++i) {
            if (data[0].types.includes(this.props.placeTypes[i])) {
              main_type = this.props.placeTypes[i];
              break
            }
          }
          this.props.changeMainType(main_type)
          address = street_number + " " + street
          this.props.selectAutoSuggestPlace({ name, address, city, state, country, countryCode, county, zip, types, placeId, latitude, longitude })
        })
    }
  }

  render = () => {
    const classes = this.props.classes

    const error = this.props.context === "City" ? !validateString(this.state.searchValue, 120, true) : this.state.searchValue.length > 120
    const helperText = this.props.context === "City" ? "Must be shorter than 120 characters and contain only alphabetical characters" : "Must be less than 120 characters"

    return (
      <Autocomplete
        freeSolo
        key={this.state.randomKey}
        // open={true}
        options={this.state.suggestions}
        getOptionLabel={(option) => option.description}
        onChange={this.props.context === "City" ? this.onChangeCity : this.onChangePlace}
        inputValue={this.state.searchValue}
        onInputChange={this.onInputChange}
        filterOptions={(options, state) => options}
        renderOption={(option, state) => {
          return <div className={clsx(classes.autocompleteOptions)}>{`${option.description}`}</div>
        }}
        classes={{
          option: classes.autocompleteOptions,
          listbox: classes.listbox
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={this.props.context}
            margin="normal"
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


export default withStyles(styles)(AutoComplete);