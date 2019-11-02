import React, { Component } from "react";

class Form extends Component {
    
    props = this.props;

    state = {
        city: "",
        country: "",
        latitude: "", 
        longitude: "",
        //username: this.props.username,
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { city, country, latitude, longitude} = this.state;
        let user = this.props.username;
        const destination = { city, country, latitude, longitude, user };
        const conf = {
            method: "post",
            body: JSON.stringify(destination),
            headers: new Headers({ 'Content-Type': 'application/json' })
        };
        console.log(this.props.endpoint, conf);
        fetch(this.props.endpoint, conf).then(response => console.log(response));
    };

    render() {
        const { city, country, latitude, longitude } = this.state;
        return (
            <div>
              <form onSubmit={this.handleSubmit}>
                <div className="field">
                  <label className="label">City</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="city"
                      onChange={this.handleChange}
                      value={city}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Country</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="country"
                      onChange={this.handleChange}
                      value={country}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Latitude</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="latitude"
                      onChange={this.handleChange}
                      value={latitude}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Longitude</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="longitude"
                      onChange={this.handleChange}
                      value={longitude}
                    />
                  </div>
                </div>
                <div className="control">
                  <button type="submit" className="button is-info">
                    Upload
                  </button>
                </div>
            </form>
          </div>
        )
    }

}

export default Form
