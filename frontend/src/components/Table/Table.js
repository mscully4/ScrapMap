import React, { Component } from 'react';
import { Column, Table } from 'react-virtualized';
import { PropTypes } from 'prop-types'
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import ReactCountryFlag from "react-country-flag"

import 'react-virtualized/styles.css';
// import "flag-icon-css/css/flag-icon.min.css";

import { getDistanceBetweenTwoPoints } from '../../utils/Formulas.js';
import { place_colors, FONT_GREY, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4, ICE_BLUE } from "../../utils/colors"
import { add, gallery, Svg } from "../../utils/SVGs"
import { placeTypeSVGs } from '../../utils/SVGs'
import OptionsDropdown from './Dropdown';

//Places within these distances of the center of the map will be included in the table
const DISTANCE_FROM_CITY = 200 /*miles*/
const DISTANCE_FROM_PLACE = 200

const styles = theme => ({
  container: {
    backgroundColor: OFF_BLACK_2,
    width: '100%'
  },
  tableRow: {
    cursor: 'pointer',
    '&:focus': {
      outline: "none"
    },
  },
  row_a: {
    backgroundColor: OFF_BLACK_3
  },
  row_b: {
    backgroundColor: OFF_BLACK_4

  },
  tableRowHover: {
    backgroundColor: ICE_BLUE,
  },
  cell: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "1fr 1fr 1fr",
    alignItems: 'center'
  },
  cellText: {
    textAlign: 'center',
    paddingLeft: "30%",
    paddingRight: '2.5%',
    margin: 'auto',
    color: FONT_GREY,
    whiteSpace: 'normal',
    wordWrap: 'break-word'
  },
  addSVG: {
    position: 'absolute',
    top: 10,
    right: 25,
    height: 25,
    width: 25,
  },
  photoGallerySVG: {
    position: 'absolute',
    height: 25,
    width: 30,
    top: 10,
    right: 25,

  },
  typeSVG: {
    position: 'absolute',
    height: '50%',
    left: 40,
    top: '25%',
  },
  columnHeader: {
    textAlign: "center",
    color: FONT_GREY
  }
})

class VirtualTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollTop: 0,
      dropdownOpen: false,
      allowMouseOver: true,
    }
  }

  handleScroll = ({ target: { scrollTop } }) => {
    this.setState({ scrollTop });
  };

  getRowClassName = (index, obj) => {
    const classes = this.props.classes;
    return clsx({ [classes.tableRow]: index !== -1 },
      { [classes.tableRowHover]: (obj ? obj.index : -1) === this.props.hoverIndex },
      { [classes.row_b]: index % 2 === 0 },
      { [classes.row_a]: index % 2 === 1 },
    )
  }

  generateSVG = (type) => {
    const icons = placeTypeSVGs;
    var paths = icons[type].path.map((el, i) => <path key={`${i}`} d={el} fill={place_colors[type]} stroke={place_colors[type]} />)
    return (
      <Svg className={clsx(this.props.classes.typeSVG)} viewbox={icons[type].viewBox}>
        {paths}
      </Svg>
    )
  }
  cellRendererPlace = (cellData) => {
    const classes = this.props.classes;
    const color = place_colors[cellData.rowData.main_type];
    return (
      <div>

        <div className={clsx(classes.cellText)} style={{ color: color }}>{cellData.rowData.name}</div>
        <div className={clsx(classes.cellText)} style={{ color: color }}>{cellData.rowData.address}</div>
        <div className={clsx(classes.cellText)} style={{ color: color }}>{cellData.rowData.city} {cellData.rowData.state ? `, ${cellData.rowData.state}` : ""}</div>

        {this.generateSVG(cellData.rowData.main_type)}


        {this.props.owner ?
          <OptionsDropdown
            toggleEditForm={this.props.toggleEditForm}
            cellData={cellData}
            handleDelete={this.props.handleDeletePlace}
            color={color}
          /> : null
        }

        {this.props.owner ? 
        <Svg viewBox={add.viewBox} value={"KILL"} className={clsx(classes.addSVG)} onClick={() => this.props.toggleUploader(cellData.cellData.pk)}>
          {add.path.map((el, i) => <path value={"KILL"} key={`${i}`} d={el} stroke={color} fill={color} />)}
        </Svg> : null }
      </div>
    )
  }

  cellRendererCity = (cellData) => {
    const classes = this.props.classes;
    var greyOutGalleryIcon = true;

    cellData.rowData.places.forEach(element => {
      if (element.images.length > 0) greyOutGalleryIcon = false
    });

    return (
      <div>
        <ReactCountryFlag
          countryCode={cellData.rowData.countryCode}
          svg
          style={{
            position: "absolute",
            height: '30%',
            left: '10%',
            top: '35%',
            width: 'auto'
          }}
          title={cellData.rowDate}
        />

        <p className={clsx(classes.cellText)}>
          {cellData.rowData.city}, <br />   {cellData.rowData.country}
        </p>


        {this.props.owner ?
          <OptionsDropdown
            toggleEditForm={this.props.toggleEditForm}
            cellData={cellData}
            handleDelete={this.props.handleDeleteCity}
            color={FONT_GREY}
          /> : null
        }

        <Svg
          className={clsx(this.props.classes.photoGallerySVG)}
          onClick={(e) => { if (!greyOutGalleryIcon) this.props.onCityGalleryClick(cellData.cellData, e) }}
          value={"KILL"}
          viewBox={gallery.viewBox}
        >
          {gallery.path.map((el, i) => <path key={`${i}`} d={el} fill={`rgba(248, 248, 248, ${greyOutGalleryIcon ? ".2" : "1"})`} />)}
        </Svg>

      </div>
    )
  }

  getPlaces = () => {
    //If the closest city is within X miles, render its places, otherwise render all places within a Y mile radius
    return this.props.places.filter((el) => this.props.closestCity.distanceFromMapCenter <= DISTANCE_FROM_CITY ?
      this.props.closestCity && el.destination === this.props.closestCity.pk :
      getDistanceBetweenTwoPoints(this.props.mapCenter.lat, this.props.mapCenter.lng, el.latitude, el.longitude) < DISTANCE_FROM_PLACE
    )
  }

  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: FONT_GREY
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props} />
    );
  }

  renderView = ({ style, ...props }) => {
    //this hides the default scrollbar
    style.marginRight = -50;
    style.marginBottom = -50;
    return <div style={style} {...props} />
  }


  render = () => {
    const WIDTH = window.innerWidth * .36;
    const HEIGHT = window.innerHeight;
    const list = this.props.granularity ? this.props.cities : this.getPlaces();

    const HEADER_HEIGHT = 40;

    const classes = this.props.classes
    return (
      <div className={classes.container}>

        <Scrollbars
          // className={clsx(classes.scrollBar)}
          onScroll={this.handleScroll}
          renderThumbVertical={obj => this.renderThumb(obj)}
          renderView={this.renderView}
        >
          <Table
            autoHeight
            scrollTop={this.state.scrollTop}
            width={WIDTH}
            height={HEIGHT}
            headerHeight={HEADER_HEIGHT}
            rowHeight={HEIGHT / 5}
            rowCount={list.length}
            rowGetter={({ index }) => list[index]}
            rowClassName={({ index }) => this.getRowClassName(index, list[index])}
            onRowMouseOver={(obj) => {
              if (this.state.allowMouseOver) {
                this.props.changeHoverIndex(obj.rowData.index);
                this.props.changeMapCenter(obj.rowData);
              }
            }}
            onRowMouseOut={() => this.props.changeHoverIndex(null)}
            onRowClick={(obj, e) => {
              //Temporarily disable the mouse over functionality to avoid a mouse over action right after a click event
              this.setState({
                allowMouseOver: false,
              })
              this.props.changeMapCenter(obj.rowData);
              this.props.tableRowClick(obj, e)
              setTimeout(() => {
                this.setState({
                  allowMouseOver: true
                })
              }, 250)
            }}
          >
            <Column
              label="Destination"
              dataKey="destination"
              width={WIDTH}
              headerStyle={{
                color: FONT_GREY,
              }}
              headerRenderer={() => {
                return (
                  <div className={classes.columnHeader}>
                    {this.props.granularity ? "Destinations" : "Places"}
                  </div>
                )
              }}
              cellRenderer={this.props.granularity ? this.cellRendererCity : this.cellRendererPlace}
              cellDataGetter={({ dataKey, rowData }) => rowData}
            />
          </Table>
        </Scrollbars>
      </div>

    )
  }
}

VirtualTable.propTypes = {
  "owner": PropTypes.bool,
  "cities": PropTypes.array,
  "places": PropTypes.array,
  "hoverIndex": PropTypes.number,
  "changeHoverIndex": PropTypes.func,
  "tableRowClick": PropTypes.func,
  "toggleEditForm": PropTypes.func,
  "handleDeleteCity": PropTypes.func,
  "handleDeletePlace": PropTypes.func,
  "toggleUploader": PropTypes.func,
  "granularity": PropTypes.number,
  "selectedCity": PropTypes.object,
  "closestCity": PropTypes.object,
  "mapCenter": PropTypes.object,
  "changeMapCenter": PropTypes.func,
  "onCityGalleryClick": PropTypes.func,
  "place_colors": PropTypes.object,
  "city_colors": PropTypes.array
}

export default withStyles(styles)(VirtualTable);
