import React from 'react';
import Map from '../components/Map';
import Table from '../components/Table'

const style = {
  main: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "2fr 1fr",
    width: '90%',
    margin: 'auto'
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  render() {
    return (
      <div style={style.main}>

        <Map 
        width={ this.props.width } 
        height={ this.props.height } 
        cities={ this.props.cities }
        logged_in={ this.props.loggedIn }
        handleEditCity={this.props.handleEditCity}
        handleDeleteCity={this.props.handleDeleteCity}
        handleImageOverwrite={this.props.handleImageOverwrite}
        backendURL={this.props.backendURL}
        hoverIndex={this.props.hoverIndex}
        changeHoverIndex={this.props.changeHoverIndex}
        />

        <Table 
        cities={this.props.cities}
        backendURL={this.props.backendURL}
        hoverIndex={this.props.hoverIndex}
        changeHoverIndex={this.props.changeHoverIndex}
        />

      </div>
    ) 
  }
}

export default Main;