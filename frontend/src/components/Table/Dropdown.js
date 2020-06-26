import React from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { PropTypes } from 'prop-types'
import { ellipsis, Svg } from "../../utils/SVGs"
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles';
import { OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4, ICE_BLUE } from '../../utils/colors';

const styles = theme => ({
  icon: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  dropdownMenu: {
    backgroundColor: OFF_BLACK_1,
    borderColor: ICE_BLUE,
    border: "solid 1px",
  },
  dropdownItem: {
    color: ICE_BLUE,
    "&:hover": {
      backgroundColor: OFF_BLACK_4,
      color: ICE_BLUE,
    }
  }
})

class OptionsDropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
    }
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }))
  }

  render() {
    return (
      <Dropdown value="KILL" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown} className={clsx(this.props.classes.icon)}>
        <DropdownToggle value="KILL" tag="span" data-toggle="dropdown" id="dropdown-custom-components">
          <Svg
            viewBox={ellipsis.viewBox}
            style={{ width: 30 }}
            fill={this.props.color}
            value="KILL"
          >
            {ellipsis.path.map((el, i) => <path key={`${i}`} d={el} value="KILL" />)}
          </Svg>
        </DropdownToggle>
        <DropdownMenu value="KILL" className={clsx(this.props.classes.dropdownMenu)}>
          <DropdownItem key="1" value="KILL" className={clsx(this.props.classes.dropdownItem)} onClick={() => this.props.toggleEditForm(true)}>Edit</DropdownItem>
          <DropdownItem key="2" value="KILL"className={clsx(this.props.classes.dropdownItem)} onClick={(e) => this.props.handleDelete(e, this.props.cellData.cellData)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

OptionsDropdown.propTypes = {
  toggleEditForm: PropTypes.func,
  handleDelete: PropTypes.func, 
  color: PropTypes.string,
  cellData: PropTypes.object
}

export default withStyles(styles)(OptionsDropdown);