import React from 'react';
import ReactDOM from 'react-dom';
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/assets/index.css';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input} from 'reactstrap';
import ReactAutocomplete from 'react-autocomplete';


// const placeURL= "https://maps.googleapis.com/maps/api/place/autocomplete/json?types=establishment&strictbounds&"
const placeURL= "https://maps.googleapis.com/maps/api/place/autocomplete/json?strictbounds&"

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
        this.loadPlaceSuggestions(value).then(json => {
          //TODO this might require some tweeaking
          var predictions = json.predictions.filter((pred) => pred.types.includes("establishment") ? true : false);
          this.setState({ 
            suggestions: predictions 
          })
        })
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
    console.log(placeURL + parameters)
    return fetch(placeURL + parameters, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.ok ? resp.json() : [])
  }

  loadCitySuggestions = (input) => {
    const parameters = `input=${input}&key=${this.state.apiKey}`
    return fetch(cityURL + parameters, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.ok ? resp.json() : [])
  }


  onSelectPlace = (obj, selection) => {
    const place_id = selection.place_id
    const name = selection.terms[0].value
    geocodeByPlaceId(place_id).then(data => {
      var street_number = "", street = "", county = "", city = "", state = "", zip = "", country = "", address = "";
      data[0].address_components.forEach(element => {
        if (element.types.includes("street_number")) street_number = element.long_name;
        else if (element.types.includes("route")) street = element.long_name;
        else if (element.types.includes("sublocality")) county = element.long_name;
        else if (element.types.includes("locality")) city = element.long_name;
        else if (element.types.includes( "administrative_area_level_1")) state = element.long_name;
        else if (element.types.includes( "administrative_area_level_2")) county = element.long_name
        else if (element.types.includes("country")) country = element.long_name;
        else if (element.types.includes("postal_code")) zip = element.long_name;
      }); 
      //TODO need to make the appropriate data model changes and then swap these out
      const latitude = parseFloat(data[0].geometry.location.lat().toFixed(4));
      const longitude = parseFloat(data[0].geometry.location.lng().toFixed(4));
      const placeId = data[0].place_id
      const types = data[0].types.join(",")
      console.log(data[0])
      address = street_number + " " + street
      this.props.selectAutoSuggestPlace({name, address, city, state, country, county, zip, types, placeId, latitude, longitude})
    })
  }

  render = () => {
    return (
      <ReactAutocomplete
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
        return <Input {...rest} innerRef={ref} placeholder={"Name"}/>
      }}
      wrapperProps={{style: {width: '100%'}}}
      />
    )}
  }
  
 
export default AutoComplete;