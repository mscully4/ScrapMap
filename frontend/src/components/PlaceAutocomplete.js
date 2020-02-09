import React from 'react';
import ReactDOM from 'react-dom';
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
import { debounce } from '../utils/fetchUtils'
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/assets/index.css';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input} from 'reactstrap';
 
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?strictbounds&types=establishment&'
const LAT = 50.0755
const LONG = 14.4378

//const BASE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?strictbounds&input=Bar&types=establishment&location=40.7,-74&radius=5000&strictbounds&key=AIzaSyBpXqyXMWAbXFs6XCxkMUFX09ZuHzjpKHU

const SUGGESTIONS = 5;

const options = {
  types: ["establishment", "tourist_attraction"],
}

const style = {
  dropdownItem: {
    cursor: 'pointer'
  }
}


class PlaceAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: null,
      inputValue: "",
      apiKey: "AIzaSyBpXqyXMWAbXFs6XCxkMUFX09ZuHzjpKHU",

    };

    this.myRef = React.createRef();
    this.debouncedGeneratePlaces = debounce(this.generatePlaces, 1000)
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    if (value.length > 4) {
      //TODO Properl debounce this
      this.debouncedGeneratePlaces(value, LAT, LONG, 50000)
      .then(data => console.log(data))
    }

    this.setState({
      place: value,
    })
  }

  generatePlaces = (input, lat, lng, radius=500000) => {
    var url = BASE_URL + `&input=${input.replace("/ /", "+")}&location=${lat},${lng}&radius=${radius}&key=${this.state.apiKey}`
    console.log(url)
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.ok ? res.json() : null)
  }

  // onSelect = (selection) => {
  //   const city = selection.terms[0].value
  //   const country = selection.terms[selection.terms.length - 1].value;
  //   geocodeByPlaceId(selection.place_id).then((data) => {
  //     let state, latitude, longitude, countryCode;
  //     let address;
  //     console.log(data[0])
  //     for (var i=0; i<data[0].address_components.length; ++i) {
  //       address = data[0].address_components[i];

  //       state = address.long_name === "United States" ? data[0].address_components[i-1].long_name : state;
  //       latitude = parseFloat(data[0].geometry.location.lat().toFixed(4));
  //       longitude = parseFloat(data[0].geometry.location.lng().toFixed(4));
  //       countryCode = address.types && address.types.includes('country') ? address.short_name.toLowerCase() : countryCode
  //     }
  //     console.log({city, country, latitude, longitude, countryCode, state})
  //     this.props.selectAutoSuggest({city, country, latitude, longitude, countryCode, state})

  //   })
  // }

  render = () => {
    //console.log(this.myRef)
    return (
      <div>
         <Input
          type="text"
          name="place"
          placeholder="Place"
          value={this.state.place}
          onChange={this.handleChange}
          autoComplete={"new-password"}
        />
      </div>
    )}
  }
  
 
export default PlaceAutoComplete;