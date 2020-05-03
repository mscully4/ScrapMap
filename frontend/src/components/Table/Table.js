import React, { Component } from 'react';
import { Column, Table } from 'react-virtualized';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-virtualized/styles.css'; // only needs to be imported once
import "flag-icon-css/css/flag-icon.min.css";
import { getDistanceBetweenTwoPoints } from '../../utils/Formulas.js';
import ReactCountryFlag from "react-country-flag"
import { place_colors } from "../../utils/colors"

import {
  add,
  gallery,
  museum,
  mountain,
  tourist_attraction,
  food,
  bar,
  park,
  establishment,
  zoo,
  university,
  amusementPark,
  casino,
  church,
  airport,
  shopping,
  stadium,
  Svg,
  city_hall
} from "../../utils/SVGs"
import OptionsDropdown from './Dropdown';

const types = [
  "natural_feature",
  ['museum', 'art_gallery'],
  "zoo",
  "church",
  "casino",
  "stadium",
  "bar",
  ["food", "restaurant"],
  "amusement_park",
  "park",
  "store",
  ["embassy", "city_hall"],
  'airport',
  "university",
  "tourist_attraction",
  "establishment"
]

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const DISTANCE_FROM_CITY = 30
const DISTANCE_FROM_PLACE = 20

const styles = theme => ({
  container: {
    backgroundColor: "#222",
    color: "#d4dada",
    width: '100%'
    // color: "#000"
  },
  scrollBar: {
    width: "100% !important",
    height: "100%",
    "& div": {
      // marginRight: "-17px !important"
    }
  },
  tableRow: {
    cursor: 'pointer',
    width: "97.5%",
    height: "100%",
    '&:focus': {
      outline: "none"
    },
    // '&:hover': {
    //   // backgroundColor: "#d4dada",
    // }
  },
  row_a: {
    backgroundColor: "#292929"
    // clickTime: Date.now(),

  },
  row_b: {
    backgroundColor: "#2e2e2e"

  },
  tableRowHover: {
    backgroundColor: "#0095d2",
  },
  cell: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "1fr 1fr 1fr",
    alignItems: 'center'
  },
  cellPlace: {
    gridTemplateColumns: "1fr 1fr 1fr"
  },
  cellFlag: {
    position: "absolute",
    height: '30%',
    left: '10%',
    top: '35%',
    width: 'auto'
  },
  cellText: {
    textAlign: 'center',
    paddingLeft: "25%",
    margin: 'auto',
    color: "#f8f8ff"
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
    // stroke: "#d4dada",
    // fill: "#d4dada"
  },
  photoGallerySVG: {
    position: 'absolute',
    height: 25,
    width: 30,
    top: 10,
    right: 10,

  },
  typeSVG: {
    position: 'absolute',
    height: '50%',
    left: 10,
    top: '25%',
    stroke: "#d4dada",
    fill: "#d4dada"
  }
})

class VirtualTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollTop: 0,
      images: [],
      dropdownOpen: false,
      ready: true,
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
    const icons = {
      museum,
      mountain,
      tourist_attraction,
      food,
      bar,
      park,
      establishment,
      zoo,
      university,
      amusementPark,
      casino,
      church,
      airport,
      shopping,
      stadium,
      city_hall
    }
    var paths = icons[type].path.map((el, i) => <path key={`${i}`} d={el} fill={place_colors[type]} stroke={place_colors[type]} />)
    return (
      <Svg className={clsx(this.props.classes.typeSVG)} viewbox={icons[type].viewBox}>
        {paths}
      </Svg>
    )
  }
  cellRendererPlace = (cellData) => {
    const classes = this.props.classes;
    const countryCode = cellData.rowData.countryCode;
    const color = place_colors[cellData.rowData.main_type];
    return (
      <div>

        <p
          className={clsx(classes.cellText)}
          style={{
            color: color
          }}
        >
          {cellData.rowData.name} <br />
          {cellData.rowData.address}
        </p>

        {this.generateSVG(cellData.rowData.main_type)}


        {this.props.context === "Owner" ?
          <OptionsDropdown
            toggleEditForm={this.props.toggleEditForm}
            cellData={cellData}
            handleDelete={this.props.handleDeletePlace}
            color={color}
          /> : null
        }

        {this.props.context === "Owner" && this.props.granularity === 0 ?
          <Svg viewBox={add.viewBox} value={"KILL"} className={clsx(classes.addSVG)} onClick={() => this.props.toggleUploader(cellData.cellData.pk)}>
            {add.path.map((el, i) => <path key={`${i}`} d={el} stroke={color} fill={color} />)}
          </Svg> : null}
      </div>
    )
  }

  cellRendererCity = (cellData) => {
    const classes = this.props.classes;
    const granularity = this.props.granularity

    var greyOutGalleryIcon = true;
    if (this.props.granularity == 1) {
      cellData.rowData.places.forEach(element => {
        if (element.images.length > 0) greyOutGalleryIcon = false
      });
    }

    const rgb = hexToRgb("#f8f8ff")
    const fill = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${greyOutGalleryIcon ? ".2" : "1"})`
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
          className={clsx(classes.cellFlag)}
          title={cellData.rowDate}
        />

        <p className={clsx(classes.cellText)}>
          {cellData.rowData.city}, <br />   {cellData.rowData.country}
        </p>

        {/* {granularity && cellData.rowData.images.length ? <img className={clsx(classes.cellImage)} src={this.props.backendURL + cellData.rowData.images[0].src}></img> : null} */}

        {this.props.context === "Owner" ?
          <OptionsDropdown
            toggleEditForm={this.props.toggleEditForm}
            cellData={cellData}
            handleDelete={this.props.granularity ? this.props.handleDeleteCity : this.props.handleDeletePlace}
            color={"#f8f8ff"}
          /> : null
        }

        {/* { this.props.context === "Owner" && this.props.granularity === 0 ?
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
        } */}

        {this.props.granularity == 1 ?
          <Svg
            className={clsx(this.props.classes.photoGallerySVG)}
            onClick={(e) => { if (!greyOutGalleryIcon) this.props.onCityGalleryClick(cellData.cellData, e) }}
            value={"KILL"}
            viewBox={gallery.viewBox}
          >
            {gallery.path.map((el, i) => <path key={`${i}`} d={el} fill={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${greyOutGalleryIcon ? ".2" : "1"})`} />)}
          </Svg> : null
        }
      </div>
    )
  }

  getPlaces = () => {
    return this.props.places.filter((el) => this.props.closestCity.distanceFromMapCenter <= DISTANCE_FROM_CITY ?
      this.props.selectedCity && el.destination === this.props.selectedCity.pk :
      getDistanceBetweenTwoPoints(this.props.mapCenter.lat, this.props.mapCenter.lng, el.latitude, el.longitude) < DISTANCE_FROM_PLACE
    )
  }

  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: "#0095d2"
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props} />
    );
  }

  renderView = ({style, ...props }) => {
    style.marginRight = -16
    console.log(style)
    return <div style={style} {...props} />
  }


  render = () => {
    const WIDTH =  window.innerWidth * .36;
    console.log(WIDTH)
    const HEIGHT = window.innerHeight;
    const list = this.props.granularity ? this.props.cities : this.getPlaces();

    const HEADER_HEIGHT = 40;

    return (
      <div className={this.props.classes.container}>

        <Scrollbars
          className={clsx(this.props.classes.scrollBar)}
          onScroll={this.handleScroll}
          renderThumbVertical={obj => this.renderThumb(obj)}
          renderView={this.renderView}

        >
          <Table
            autoHeight
            scrollTop={this.state.scrollTop}
            width={WIDTH * 1}
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
              width={WIDTH * 1}
              headerStyle={{
                color: "#d4dada",
              }}
              headerRenderer={() => {
                return (
                  <div style={{
                    textAlign: "center",
                    color: "#d4dada"
                  }}>
                    {this.props.granularity ? "Destinations" : "Places"}
                  </div>
                )
              }}
              cellRenderer={this.props.granularity ? this.cellRendererCity : this.cellRendererPlace}
              cellDataGetter={({ dataKey, rowData }) => rowData}
            //style={styles.tableRow}
            />
          </Table>
        </Scrollbars>
      </div>

    )
  }
}

export default withStyles(styles)(VirtualTable);