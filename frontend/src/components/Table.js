import React, { Component } from 'react';
import {Column, Table} from 'react-virtualized';
import clsx from 'clsx';
import { withStyles} from '@material-ui/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-virtualized/styles.css'; // only needs to be imported once
import "flag-icon-css/css/flag-icon.min.css";

import { Add1, Add2, ellipsis} from "../utils/SVGs"
import OptionsDropdown from './Dropdown';

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
  },
  addSVG: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 25,
    width: 25
  },
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
    // console.log(cellData.rowData.city)
    //TODO Find a better way to pick an image, maybe based on size
    return (
      <div className={clsx(classes.cell)} data-tip data-for={cellData.rowData.city}>
        <span className={clsx(`flag-icon flag-icon-` + cellData.rowData.countryCode, classes.cellFlag)}></span>
        <span>{cellData.rowData.city}, {cellData.rowData.country}</span>
        {cellData.rowData.images.length ? <img className={clsx(classes.cellImage)} src={this.props.backendURL + cellData.rowData.images[0].src}></img> : null}
        
        { this.props.context === "Owner" ? 
          <OptionsDropdown 
          toggleEditForm={this.props.toggleEditForm} 
          cellData={cellData} 
          handleDeleteCity={this.props.handleDeleteCity}
          /> : null 
        }

        { this.props.context === "Owner" ?
          <svg
          className={clsx(this.props.classes.addSVG)}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => this.props.toggleUploader(cellData.cellData.pk)}
          value={"KILL"}
          >
            <path
            d={Add1}
            fill="#737373"
            value={"KILL"}
            />
            <path
            d={Add2}
            fill="#737373"
            value={"KILL"}
            />
          </svg> : null
        }
        
      </div>
    )
  }

  render = () => {
    const WIDTH = window.innerWidth * .3;
    //TODO Make this the height of the main component not the whole page
    const HEIGHT = window.innerHeight;
    const list = this.props.cities;
    const HEADER_HEIGHT = 40;

    return (
      <div>

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

// const ellipsis = "M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"

// const Add1 ="M512 16C240 16 16 240 16 512s224 496 496 496 496-224 496-496S784 16 512 16z m0 960C256 976 48 768 48 512S256 48 512 48 976 256 976 512 768 976 512 976z"
// const Add2 ="M736 480h-192V288c0-19.2-12.8-32-32-32s-32 12.8-32 32v192H288c-19.2 0-32 12.8-32 32s12.8 32 32 32h192v192c0 19.2 12.8 32 32 32s32-12.8 32-32v-192h192c19.2 0 32-12.8 32-32s-12.8-32-32-32z"

export default withStyles(styles)(VirtualTable);
 