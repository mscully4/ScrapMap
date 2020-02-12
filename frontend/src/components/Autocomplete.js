import React from 'react';
import ReactDOM from 'react-dom';
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/assets/index.css';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input} from 'reactstrap';
import ReactAutocomplete from 'react-autocomplete';


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
      suggestions: [],
      apiKey: "AIzaSyBpXqyXMWAbXFs6XCxkMUFX09ZuHzjpKHU",
      value: "",
      menuOpen: false,
    };

    this.myRef = React.createRef();
  }

  handleChange = e => {
    const value = e.target.value;
    this.setState({
      value: value
    });

    switch(this.props.context) {
      case "Place":
        this.props.handleAutoCompleteChange(value)
        this.loadPlaceSuggestions(value).then(json => this.setState({ suggestions: json.predictions }))
        break;
      case "City":
        this.props.handleAutoCompleteChangeCity(value)
        this.loadCitySuggestions(value).then(json => this.setState({ suggestions: json.predictions }))
        break
    }
  };

  onSelectCity = (obj, selection) => {
    console.log(selection, obj)
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
    }).then(resp => resp.ok ? resp.json() : [])
  }

  loadCitySuggestions = (input) => {
    const parameters = `input=${input}&key=${this.state.apiKey}`
    console.log(parameters)
    return fetch(cityURL + parameters, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.ok ? resp.json() : [])
  }


  onSelectPlace = (obj, selection) => {
    console.log(selection)
    const place_id = selection.place_id

    const name = selection.terms[0].value
    //const street = selection.terms[1].value
    const city = selection.terms[2].value
    const state = selection.terms.length  > 4 && selection.terms[4].value === "USA" ? selection.terms[3].value : null
    const country = selection.terms.length > 4 && selection.terms[4].value === "USA" ? selection.terms[4].value : selection.terms[3].value
    geocodeByPlaceId(place_id).then(data => {
      console.log(data)
      const houseNumber = data[0].address_components[0].long_name
      const street = data[0].address_components[1].long_name
      const neighborhood = data[0].address_components[2].long_name
      const latitude = parseFloat(data[0].geometry.location.lat().toFixed(4));
      const longitude = parseFloat(data[0].geometry.location.lng().toFixed(4));
      // console.log(name, street, city, state, country, street_number, street2, neighborhood, latitude, longitude)
      this.props.selectAutoSuggestPlace({name, street, city, state, country, houseNumber, neighborhood, latitude, longitude})
    })
  }

  render = () => {
    const options = [
      { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
      { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
      { value: 'purple', label: 'Purple', color: '#5243AA' },
      { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
      { value: 'orange', label: 'Orange', color: '#FF8B00' },
    ];
    return (
      <div>
            <ReactAutocomplete
          // items={[
          //   { label: 'foo' },
          //   { label: 'bar' },
          //   { label: 'baz' },
          // ]}
          items={this.state.suggestions}
          //shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
          getItemValue={item => item.description}
          renderItem={(item, highlighted) =>
            <div
              key={item.id}
              style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
            >
              {item.description}
            </div>
          }
          name={"value"}
          value={this.props.value}
          onChange={this.handleChange}
          onSelect={(value, obj) => this.props.context === "City" ? this.onSelectCity(value, obj) : this.onSelectPlace(value, obj)}
          renderInput={(props) => {
            const {ref, ...rest} = props;
            return <Input {...rest} innerRef={ref}/>
          }}
        />
      </div>
    )}
  }
  
 
export default AutoComplete;