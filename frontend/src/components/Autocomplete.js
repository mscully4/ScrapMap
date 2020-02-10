import React from 'react';
import ReactDOM from 'react-dom';
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/assets/index.css';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input} from 'reactstrap';

const placeURL= "https://maps.googleapis.com/maps/api/place/autocomplete/json?types=establishment&strictbounds&"
const cityURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&"
//input=Amoeba&location=37.76999,-122.44696&radius=500&strictbounds&key=YOUR_API_KEY

const style = {
  dropdownItem: {
    cursor: 'pointer'
  }
}

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listIndex: null,
      suggestions: null,
      apiKey: "AIzaSyBpXqyXMWAbXFs6XCxkMUFX09ZuHzjpKHU",
      input: "",
    };

    this.myRef = React.createRef();
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });

    switch(this.props.context) {
      case "Place":
        this.loadPlaceSuggestions(value).then(json => console.log(json.predictions))
        break;
      case "City":
        this.loadCitySuggestions(value).then(json => console.log(json.predictions))
        break
    }
  };

  onSelectCity = (selection) => {
    console.log("City")
    const city = selection.terms[0].value
    const country = selection.terms[selection.terms.length - 1].value;
    geocodeByPlaceId(selection.place_id).then((data) => {
      let state, latitude, longitude, countryCode;
      let address;
      console.log(data[0])
      for (var i=0; i<data[0].address_components.length; ++i) {
        address = data[0].address_components[i];

        state = address.long_name === "United States" ? data[0].address_components[i-1].long_name : state;
        latitude = parseFloat(data[0].geometry.location.lat().toFixed(4));
        longitude = parseFloat(data[0].geometry.location.lng().toFixed(4));
        countryCode = address.types && address.types.includes('country') ? address.short_name.toLowerCase() : countryCode
      }
      console.log({city, country, latitude, longitude, countryCode, state})
      this.props.selectAutoSuggestCity({city, country, latitude, longitude, countryCode, state})

    })
  }

  loadPlaceSuggestions = (input) => {
    const parameters = `input=${input}&location=${this.props.location.lat},${this.props.location.lng}&radius=${this.props.location.radius}&key=${this.state.apiKey}`
    console.log(parameters)
    return fetch(placeURL + parameters, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
  }

  loadCitySuggestions = (input) => {
    const parameters = `input=${input}&key=${this.state.apiKey}`
    console.log(parameters)
    return fetch(cityURL + parameters, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())

  }


  onSelectPlace = (selection) => {
    console.log("Place")
  }

  render = () => {
    const options={
      types: "establishment",
      location: { lat: 20, lng: 20 },
      radius: 50000
    }
    return (
      <div>
        <Input
        type="text"
        name="input"
        value={this.state.input}
        onChange={this.handleChange}
        />
      </div>
    )}
  }
  
 
export default AutoComplete;