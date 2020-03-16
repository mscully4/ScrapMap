import React, { Component } from 'react';
import {Column, Table} from 'react-virtualized';
import clsx from 'clsx';
import { withStyles} from '@material-ui/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-virtualized/styles.css'; // only needs to be imported once
import "flag-icon-css/css/flag-icon.min.css";

import { Add1, Add2, photoGallery1} from "../utils/SVGs"
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
  gray: {
    backgroundColor: "#f3f3f3"
  },
  white: {
    backgroundColor: "#f9f9f9"
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
    width: 25,
    stroke: "#000000"
  },
  photoGallerySVG: {
    position: 'absolute',
    height: 25,
    width: 30,
    top: 10,
    right: 10,
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

  // cellRendererCity = (cellData) => {
  //   const classes = this.props.classes;
  //   // console.log(cellData.rowData.city)
  //   //TODO Find a better way to pick an image, maybe based on size
  //   return (
  //     <div className={clsx(classes.cell)}>
  //       <span className={clsx(`flag-icon flag-icon-` + cellData.rowData.countryCode, classes.cellFlag)}></span>
  //       <span>{cellData.rowData.city}, {cellData.rowData.country}</span>
  //       {cellData.rowData.images.length ? <img className={clsx(classes.cellImage)} src={this.props.backendURL + cellData.rowData.images[0].src}></img> : null}
        
  //       { this.props.context === "Owner" ? 
  //         <OptionsDropdown 
  //         toggleEditForm={this.props.toggleEditForm} 
  //         cellData={cellData} 
  //         handleDeleteCity={this.props.handleDeleteCity}
  //         /> : null 
  //       }

  //       { this.props.context === "Owner" ?
  //         <svg
  //         className={clsx(this.props.classes.addSVG)}
  //         viewBox="0 0 1024 1024"
  //         version="1.1"
  //         xmlns="http://www.w3.org/2000/svg"
  //         onClick={() => this.props.toggleUploader(cellData.cellData.pk)}
  //         value={"KILL"}
  //         >
  //           <path
  //           d={Add1}
  //           fill="#737373"
  //           value={"KILL"}
  //           />
  //           <path
  //           d={Add2}
  //           fill="#737373"
  //           value={"KILL"}
  //           />
  //         </svg> : null
  //       }

  //       <svg
  //         className={clsx(this.props.classes.photoGallerySVG)}
  //         viewBox="0 0 512 512"
  //         version="1.1"
  //         xmlns="http://www.w3.org/2000/svg"
  //         onClick={this.props.toggleGallery}
  //         //value={"KILL"}
  //         >
  //           <path
  //           d={photoGallery1}
  //           fill="#737373"
  //           //value={"KILL"}
  //           />
  //       </svg> 
  //     </div>
  //   )
  // }

  cellRenderer = (cellData) => {
    const classes = this.props.classes;
    const granularity = this.props.granularity

    var greyOutGalleryIcon = true;
    if (this.props.granularity == 1) {
      cellData.rowData.places.forEach(element => {
        if (element.images.length > 0) greyOutGalleryIcon = false
      });
    }
    //TODO Find a better way to pick an image, maybe based on size
    return (
      <div className={granularity ? clsx(classes.cell) : null}>
        {granularity ? <span className={clsx(`flag-icon flag-icon-` + cellData.rowData.countryCode, classes.cellFlag)}></span> : null}

        {this.props.granularity ? 
          <span>{cellData.rowData.city}, {cellData.rowData.country}</span> : 
          <span>{cellData.rowData.name}</span>
        }

        {granularity && cellData.rowData.images.length ? <img className={clsx(classes.cellImage)} src={this.props.backendURL + cellData.rowData.images[0].src}></img> : null}
        
        { this.props.context === "Owner" ? 
          <OptionsDropdown 
          toggleEditForm={this.props.toggleEditForm} 
          cellData={cellData} 
          handleDelete={this.props.granularity ? this.props.handleDeleteCity : this.props.handleDeletePlace}
          /> : null 
        }

        { this.props.context === "Owner" && this.props.granularity === 0 ?
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
            value={"KILL"}
            />
            <path
            d={Add2}
            value={"KILL"}
            />
          </svg> : null
        }

        { this.props.granularity == 1 ?
          <svg
          className={clsx(this.props.classes.photoGallerySVG)}
          viewBox="0 0 512 512"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          onClick={(e) => { if (!greyOutGalleryIcon) this.props.onCityGalleryClick(cellData.cellData, e)}}
          value={"KILL"}
          >
            <path
            d={photoGallery1}
            fill={greyOutGalleryIcon ? "#bbb" : "#222"}
            value={"KILL"}
            />
          </svg> 
          : null
        }
      </div>
    )
  }

  render = () => {
    const WIDTH = window.innerWidth * .3;
    //TODO Make this the height of the main component not the whole page
    const HEIGHT = window.innerHeight;
    // console.log(this.props.closestCity)
    const list = this.props.granularity ? this.props.cities : this.props.closestCity.distanceFromMapCenter <= 20 ? this.props.places.filter((val) => val.destination === this.props.selectedCity.pk ? true : false) : [];

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
          width={WIDTH}
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
          onRowMouseOut={() => this.props.changeHoverIndex(null)}
          onRowClick={(obj, e) => {
            this.props.tableRowClick(obj, e)
            this.props.changeMapCenter(obj.rowData);

          }}
          >
            <Column 
            label="Destination" 
            dataKey="destination" 
            width={WIDTH}
            cellRenderer={this.cellRenderer}
            cellDataGetter={({dataKey, rowData}) => rowData}
            //style={styles.tableRow}
            />
          </Table>
        </Scrollbars>
      </div>
      
    )
  }
} 

export default withStyles(styles)(VirtualTable);
 