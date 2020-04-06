import React from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { ellipsis, Svg } from "../utils/SVGs"

const theme = {
  dropdown: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  svg: {
    width: 30,
    // fill: "#d4dada"

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
    return (
      <Dropdown value="KILL" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown} style={theme.dropdown}>
        <DropdownToggle value="KILL" tag="span" data-toggle="dropdown" id="dropdown-custom-components">
          <Svg
            viewBox="0 180 512 150"
            style={theme.svg}
            fill={this.props.color}
            value="KILL"
          >
            {ellipsis.path.map(el => <path d={el} value="KILL" />)}
          </Svg>
        </DropdownToggle>
        <DropdownMenu style={theme.dropdownMenu} value="KILL">
          <DropdownItem value="KILL" onClick={() => this.props.toggleEditForm(true)}>Edit</DropdownItem>
          <DropdownItem value="KILL" onClick={(e) => this.props.handleDelete(e, this.props.cellData.cellData)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }
}