import React, { Component } from 'react';
import {Column, Table} from 'react-virtualized';
import clsx from 'clsx';
import { withStyles} from '@material-ui/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-virtualized/styles.css'; // only needs to be imported once
import "flag-icon-css/css/flag-icon.min.css";
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';  

const styles = theme => ({
  scrollBar: {
    width: "100%",
    height: "100%",
  },
  tableRow: {
    cursor: 'pointer',
    width: "97.5%",
    height: "100%",
    '&:focus': {
      outline: "none"
    },
    '&:hover': {
      backgroundColor: "#BBBBBB",
    }
  },
  white: {
    backgroundColor: "#f3f3f3"
  },
  gray: {
    backgroundColor: "#ffffff"
  },
  tableRowHover: {
    backgroundColor: "#BBBBBB",
  },
  cell: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "1fr 1fr 1fr",
    alignItems: 'center'
  },
  cellFlag: {
    width: 40,
    height: 40,
    margin: 'auto'
  },
  cellText: {

  },
  cellImage: {
    width: 100,
    height: 100,
    margin: 'auto'
  }
})

class VirtualTable extends Component {
  constructor(props) {
    super(props)
    this.state ={
      scrollTop: 0,
      images: [],
      dropdownOpen: false
    }
  }

  toggleDropdown = () => {
    const dropdownOpen = this.state.dropdownOpen;
    console.log(dropdownOpen)
    //if (value === undefined) value = this.state.dropdownOpen;
    this.setState({
      dropdownOpen: !dropdownOpen
    })
  }

  handleScroll = ({ target: { scrollTop } }) => {
    this.setState({ scrollTop });
  };

  getRowClassName = ({index}) => {
    //console.log(this.props.hoverIndex, index)
    const classes = this.props.classes;
    return clsx({[classes.tableRow]: index !== -1}, 
      {[classes.tableRowHover]: index === this.props.hoverIndex}, 
      {[classes.white]: index % 2 === 0}, 
      {[classes.gray]: index % 2 === 1},
    )
  }

  cellRenderer = (cellData) => {
    const classes = this.props.classes;
    //TODO Find a better way to pick an image, maybe based on size
    return (
      <div className={clsx(classes.cell)}>
        <span className={clsx(`flag-icon flag-icon-` + cellData.rowData.countryCode, classes.cellFlag)}></span>
        <span>{cellData.rowData.city}, {cellData.rowData.country}</span>
        {cellData.rowData.images.length ? <img className={clsx(classes.cellImage)} src={this.props.backendURL + cellData.rowData.images[0].src}></img> : null}
         
         {/* <Dropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggleDropdown()} style={{position: "absolute"}}>
    <DropdownToggle>
      BOOF

    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem toggle={false} onClick={()=>console.log(23)}>Edit</DropdownItem>
      <DropdownItem toggle={false} onClick={()=>console.log(22)}>Delete</DropdownItem>
    </DropdownMenu>
  </Dropdown> */}
          {/* <FontAwesomeIcon onClick={() => console.log('click')} style={{ width: '100%', height: '100%'}} icon="ellipsis-h"/> */}
          {/* <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
          viewBox="0 180 512 150"
          style={{ position: 'absolute', width: 25, top: 5, right: 15, width: 50}}
          value="ELLIPSIS"
          onClick={() => {}}
          >
            <path d={ellipsis} value="ELLIPSIS"/>
          </svg> */}
            {/* <Dropdown isOpen={true} toggle={this.toggleDropdown} style={{position: 'absolute', left: 0, top: 0}}>
    <DropdownToggle tag="div" tag="span" data-toggle="dropdown" aria-expanded={this.state.dropdownOpen} id="dropdown-custom-components">    
    <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
          viewBox="0 180 512 150"
          style={{ position: 'absolute', width: 25, top: 5, left: 15, width: 50}}
          value="ELLIPSIS"
          onClick={() => {}}
          >
            <path d={ellipsis} value="ELLIPSIS"/>
          </svg>
          </DropdownToggle>
    <DropdownMenu>
      <DropdownItem toggle={false} onClick={()=>console.log(23)}>Edit</DropdownItem>
      <DropdownItem toggle={false} onClick={()=>console.log(22)}>Delete</DropdownItem>
    </DropdownMenu>
  </Dropdown> */}
      </div>
    )
  }

  // onRowClick = (obj) => {
  //   const images = obj.rowData.images.map(img => {
  //     img.src = this.props.backendURL + img.src;
  //     return img;
  //   })
  //   this.setState({
  //     galleryOpen: true,
  //     images: images

  //   })
  // }

  render = () => {
    const WIDTH = window.innerWidth * .3;
    //TODO Make this the height of the main component not the whole page
    const HEIGHT = window.innerHeight;
    const list = this.props.cities;
    const HEADER_HEIGHT = 40;

    return (
      <div>
 <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
    <DropdownToggle>BOOF</DropdownToggle>
    <DropdownMenu>
      <DropdownItem toggle={false} onClick={()=>console.log(23)}>Edit</DropdownItem>
      <DropdownItem toggle={false} onClick={()=>console.log(22)}>Delete</DropdownItem>
    </DropdownMenu>
  </Dropdown>
        <Scrollbars
        className={clsx(this.props.classes.scrollBar)}
        onScroll={this.handleScroll}
        >
          <Table
          autoHeight
          scrollTop={this.state.scrollTop}
          width={WIDTH * .97}
          height={HEIGHT}
          headerHeight={HEADER_HEIGHT}
          rowHeight={HEIGHT / 5}
          rowCount={list.length}
          rowGetter={({index}) => list[index]}
          rowClassName={this.getRowClassName}
          onRowMouseOver={(obj) => {
            this.props.changeHoverIndex(obj.rowData.index);
            this.props.changeMapCenter(obj.rowData);
          }}
          onRowMouseOut={(obj) => this.props.changeHoverIndex(null)}
          onRowClick={this.props.tableRowClick}
          >
            <Column 
            label="Destination" 
            dataKey="destination" 
            width={WIDTH - 5} 
            cellRenderer={this.cellRenderer}
            cellDataGetter={({dataKey, rowData}) => {return rowData}}
            //style={styles.tableRow}
            />
          </Table>
        </Scrollbars>
      </div>
      
    )
  }
} 

const ellipsis = "M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"
export default withStyles(styles)(VirtualTable);
 