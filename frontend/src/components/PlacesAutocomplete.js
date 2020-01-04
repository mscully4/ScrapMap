import React from 'react';
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/assets/index.css';
import {
  Input,
} from 'reactstrap';
 
class PlacesAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {} 
  }

  
  render = () => {
    const options = {
      types: ["(cities)"],
    }
    return (
      <div>
        <GooglePlacesAutocomplete
          autocompletionRequest = {options}
          placeholder={"City"}
          onSelect={(selection) => {
            console.log(selection)
            const city = selection.terms[0].value
            const country = selection.terms[selection.terms.length - 1].value;
            geocodeByPlaceId(selection.place_id).then((data) => {
              console.log(data)
              const latitude = parseFloat(data[0].geometry.location.lat().toFixed(4));
              const longitude = parseFloat(data[0].geometry.location.lng().toFixed(4));
              const countryCode = data[0].address_components[data[0].address_components.length - 1].short_name.toLowerCase()
              this.props.selectAutoSuggest({city, country, latitude, longitude, countryCode})
            })
          }}
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
            <div style={{position: "absolute", width: "100%", backgroundColor: "#fff", border: "solid 3px #dbecff", borderTop: "0", borderRadius: 5}}>
              {
                suggestions.map((suggestion) => (
                  <div className="suggestion"
                    style={{cursor: "pointer"}}
                    onClick={(event) => onSelectSuggestion(suggestion, event)}
                  >
                    {suggestion.description}
                  </div>
                ))
              }
            </div>
          )}
        />
      </div>
    )}
  }
  
 
export default PlacesAutoComplete;