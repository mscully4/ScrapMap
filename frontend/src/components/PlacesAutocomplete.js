import React from 'react';
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/assets/index.css';
import {
  Button,
  Form,
  Input,
  InputGroup,
  Modal, 
  ModalHeader,
  ModalBody,
  ModalFooter,
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
            const city = selection.terms[0].value
            const country = selection.terms[selection.terms.length - 1].value;
            geocodeByPlaceId(selection.place_id).then((data) => {
              const latitude = data[0].geometry.location.lat();
              const longitude = data[0].geometry.location.lng();
              this.props.selectAutoSuggest({city, country, latitude, longitude})
            })
          }}
          renderInput={(props) => (
            <div>
              <Input
                {...props}
              />
            </div>
          )}
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