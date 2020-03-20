import React from 'react';
import Map from '../components/Map';

export default class Test extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
      }
    }

    componentDidMount = () => {
        console.log("I mounted")
        console.log(this.props)
    }

  
    render() {
      return(
        <div>
        </div>
      )
    }
}