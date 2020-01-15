import React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';

const theme = {
  dropdown: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  svg: {
    width: 30,
  },
  dropdownMenu: {
    // left: -120,
    // position: 'absolute'
  }
}

export default class OptionsDropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
    }
  }

  toggleDropdown = () => {
    //when opening dropwdown add the row data to selectedCity for use on edit form, otherwise set selectedCity to null
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }))
  }

  render() {
    return(
      <Dropdown value="DROPDOWN" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown} style={theme.dropdown}>
        <DropdownToggle value="DROPDOWN" tag="span" data-toggle="dropdown" id="dropdown-custom-components">   
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            viewBox="0 180 512 150"
            style={theme.svg}
            value="DROPDOWN"
            onClick={() => {}}
            >
              <path d={ellipsis} value="DROPDOWN"/>
            </svg>
          </DropdownToggle>
          <DropdownMenu style={theme.dropdownMenu} value="DROPDOWN">
            <DropdownItem value="DROPDOWN" onClick={() => this.props.toggleEditForm(true)}>Edit</DropdownItem>
            <DropdownItem value="DROPDOWN" onClick={()=>console.log(22)}>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown> 
    )
    }
  }

    const ellipsis = "M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"

