import React from 'react';
//TODO replace this with custom code
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/assets/index.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ICE_BLUE, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4, FONT_GREY } from '../../utils/colors';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx'


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
  }

  componentDidMount = () => {
    this.props.clearSuggestionsHook(this.clearSuggestions)
  }

  clearSuggestions = () => {
    this.setState({
      suggestions: []
    })
  }

  handleChange = e => {
    const value = e.target.value;
    this.setState({
      value: value
    });

    switch (this.props.context) {
      case "Place":
        this.props.handleAutoCompleteChange(value)
        this.loadPlaceSuggestions(value)
          .then(json => {
            var predictions = json.predictions.filter((pred) => pred.types.includes("establishment") ? true : false);
            this.setState({
              suggestions: predictions
            })
          })
          .catch(err => {
            this.props.setError(true, err)
          })
        break;
      case "City":
        this.props.handleAutoCompleteChangeCity(value)
        this.loadCitySuggestions(value)
          .then(response => {
            if (!response.ok) {
              this.props.setError(true, response.statusText)
              throw Error(response.statusText)
            }
            return response.json()
          })
          .then(json => this.setState({ suggestions: json.predictions }))
          .catch(err => console.log(err))
        break
    }
  };

  onSelectCity = (obj, selection) => {
    const city = selection.terms[0].value
    const country = selection.terms[selection.terms.length - 1].value;
    geocodeByPlaceId(selection.place_id).then((data) => {
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


  onSelectPlace = (obj, selection) => {
    const place_id = selection.place_id
    const name = selection.terms[0].value
    geocodeByPlaceId(place_id).then(data => {
      console.log(data)
      // var street_number = "", street = "", county = "", city = "", state = "", zip = "", country = "", address = "", countryCode = "";
      // data[0].address_components.forEach(element => {
      //   if (element.types.includes("street_number")) street_number = element.long_name;
      //   else if (element.types.includes("route")) street = element.long_name;
      //   else if (element.types.includes("sublocality")) county = element.long_name;
      //   else if (element.types.includes("locality")) city = element.long_name;
      //   else if (element.types.includes("administrative_area_level_1")) state = element.long_name;
      //   else if (element.types.includes("administrative_area_level_2")) county = element.long_name
      //   else if (element.types.includes("country")) {
      //     country = element.long_name;
      //     countryCode = element.short_name === "US" ? "US" : element.short_name;
      //   }
      //   else if (element.types.includes("postal_code")) zip = element.long_name;
      // });
      // const latitude = parseFloat(data[0].geometry.location.lat().toFixed(4));
      // const longitude = parseFloat(data[0].geometry.location.lng().toFixed(4));
      // const placeId = data[0].place_id
      // const types = data[0].types.join(",")
      // //Establishment is the default type for all results
      // var main_type = "establishment";
      // for (var i = 0; i < this.props.placeTypes.length; ++i) {
      //   if (data[0].types.includes(this.props.placeTypes[i])) {
      //     main_type = this.props.placeTypes[i];
      //     break
      //   }
      // }
      // // this.props.changeMainType(main_type)
      // address = street_number + " " + street
      // this.props.selectAutoSuggestPlace({ name, address, city, state, country, countryCode, county, zip, types, placeId, latitude, longitude })
    })
  }

  onChangeCity = (e, option, reason) => {
    console.log(option, reason)
    const city = option.terms[0].value
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


  onChangePlace = (e, option, reason) => {
    const place_id = option.place_id
    const name = option.terms[0].value
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

  onInputChange = (e, obj, reason) => {
    this.setState({
      searchValue: obj
    })

    if (obj !== "") {
      switch (this.props.context) {
        case "Place":
          if (obj !== "") {
            this.props.handleAutoCompleteChange(obj)
            this.loadPlaceSuggestions(obj)
              .then(response => {
                if (!response.ok) {
                  this.props.setError(true, response.statusText)
                  throw Error(response.statusText)
                }
                response.json()
              })
              .then(json => {
                //Only want predictions that have addresses
                var predictions = json.predictions.filter((pred) => pred.types.includes("establishment") ? true : false);
                this.setState({
                  suggestions: predictions
                })
              })
              .catch(err => console.log(err))
          }
          break;
        case "City":
          this.props.handleAutoCompleteChangeCity(obj)
          this.loadCitySuggestions(obj)
            .then(response => {
              if (!response.ok) {
                this.props.setError(true, response.statusText)
                throw Error(response.statusText)
              }
              return response.json()
            })
            .then(json => this.setState({ suggestions: json.predictions }))
            .catch(err => console.log(err))
          break
      }
    } else {
      this.setState({
        suggestions: []
      })
    }
  }

  render = () => {
    const classes = this.props.classes

    const inputProps = {
      className: clsx(classes.input),
      classes: {
        notchedOutline: clsx(classes.inputBorder),
      }
    }
    const InputLabelProps = {
      className: clsx(classes.inputLabel),
    }


    const x = (
      <Autocomplete
        freeSolo
        key={this.state.randomKey}
        open={this.state.searchSuggestionsOpen}
        options={this.state.suggestions}
        getOptionLabel={(option) => option.description}
        onChange={this.props.context === "City" ? this.onChangeCity : this.onChangePlace}
        inputValue={this.state.searchValue}
        onInputChange={this.onInputChange}
        renderOption={(option, state) => {
          return <div className={clsx(classes.searchBarOptions)}>{`${option.description}`}</div>
        }}
        classes={{
          option: classes.searchBarOptions,
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
          />
        )}
      />)

    return x
    //TODO eventually change this over to MUI
    // return (
    //   <ReactAutocomplete
    //     items={this.state.suggestions}
    //     getItemValue={item => item.description}
    //     renderItem={(item, highlighted) =>
    //       <div
    //         key={item.id}
    //         className={clsx({ [classes.dropdownItem]: true, [classes.dropdownItemHighlighted]: highlighted })}
    //       >
    //         {item.description}
    //       </div>
    //     }
    //     name={"value"}
    //     value={this.props.value}
    //     onChange={this.handleChange}
    //     onSelect={(value, obj) => this.props.context === "City" ? this.onSelectCity(value, obj) : this.onSelectPlace(value, obj)}
    //     renderInput={(props) => {
    //       const { ref, ...rest } = props;

    //       return (
    //         <TextField
    //           {...rest}
    //           innerRef={ref}
    //           label={this.props.context}
    //           variant={"outlined"}
    //           inputProps={{ "autoComplete": 'new-password' }}
    //           InputProps={inputProps}
    //           InputLabelProps={InputLabelProps}
    //           className={classes.textField}
    //         />)
    //     }}
    //     wrapperProps={{ style: { width: '100%' } }}
    //     menuStyle={{
    //       backgroundColor: OFF_BLACK_4,
    //       border: `solid 1px ${ICE_BLUE}`,
    //       borderRadius: 3,
    //       width: '90%',
    //       margin: 'auto',
    //       minWidth: 'none',
    //       visibility: this.state.suggestions.length > 0 ? 'visible' : 'hidden'
    //     }}
    //   />
    // )
  }
}


export default withStyles(styles)(AutoComplete);