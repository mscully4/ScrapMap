import React from 'react';
import ReactDOM from 'react-dom';
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/assets/index.css';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input} from 'reactstrap';
 
class PlacesAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener('keydown', function() {
      console.log('keydown')
    })

    ReactDOM.findDOMNode(this).addEventListener('keyup', function() {
      console.log('keyup')
    })

  }



  onSelect = (selection) => {
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
      this.props.selectAutoSuggest({city, country, latitude, longitude, countryCode, state})

    })
  }

  
  render = () => {
    const options = {
      types: ["(cities)"],
    }
    return (
      <div>
        <GooglePlacesAutocomplete
          autocompletionRequest={options}
          placeholder={"City"}
          onSelect={this.onSelect}
          renderInput={(props) => { 
            if (props.autoComplete === "off") {
              props.value = props.value.split(',')[0]; 
            }
            return(
            <div>
              <Input
                {...props}
              />
            </div>
          )}}
          renderSuggestions={(active, suggestions, onSelectSuggestion) => (
            // <ul onKeyDown={() => console.log(69)} style={{position: "absolute", width: "100%", backgroundColor: "#fff", border: "solid 3px #dbecff", borderTop: "0", borderRadius: 5}}>
            //   {
            //     suggestions.map((suggestion) => (
            //       <li className="suggestion"
            //         style={{cursor: "pointer"}}
            //         onClick={(event) => onSelectSuggestion(suggestion, event)}
            //       >
            //         {suggestion.description}
            //       </li>
            //     ))
            //   }
            // </ul>

            
          <DropdownMenu style={{display: 'block', width: '100%'}}>
             <DropdownItem>Edit</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
           </DropdownMenu>
          )}
        />
      </div>
    )}
  }
  
 
export default PlacesAutoComplete;