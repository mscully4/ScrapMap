import React, { Component } from 'react';
import { Column, Table } from 'react-virtualized';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-virtualized/styles.css'; // only needs to be imported once
import "flag-icon-css/css/flag-icon.min.css";
import { getDistanceBetweenTwoPoints } from '../utils/Formulas.js';
import ReactCountryFlag from "react-country-flag"


import { add, photoGallery1, mountain, touristAttraction, food, bar, park, establishment, zoo, university,amusementPark, casino, church, airport, shopping, Svg } from "../utils/SVGs"
import OptionsDropdown from './Dropdown';

//TODO look into sizing/width for the table

const DISTANCE_FROM_CITY = 30
const DISTANCE_FROM_PLACE = 20

const icons = {
  food: food,
  tourist_attraction: touristAttraction,
  natural_feature: mountain
}

const styles = theme => ({
  container: {
    backgroundColor: "#222",
    color: "#d4dada"
    // color: "#000"
  },
  scrollBar: {
    width: "100%",
    height: "100%",
    // backgroundColor: "red"
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
    margin: 'auto'
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
    stroke: "#d4dada",
    fill: "#d4dada"
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

  getRowClassName = ({ index }) => {
    //console.log(this.props.hoverIndex, index)
    const classes = this.props.classes;
    return clsx({ [classes.tableRow]: index !== -1 },
      { [classes.tableRowHover]: index === this.props.hoverIndex },
      { [classes.row_b]: index % 2 === 0 },
      { [classes.row_a]: index % 2 === 1 },
    )
  }

  generateSVG = (types) => {
    //TODO need to order these better
    var icon;
    if (types.includes("natural_feature")) {
      icon = mountain;
    } else if (types.includes("zoo")) {
      icon = zoo;
    } else if (types.includes("church")) {
      icon = church;
    } else if (types.includes("casino")) {
      icon = casino;
    } else if (types.includes("bar")) {
      icon = bar;
    } else if (types.includes("food") || types.includes("restaurant")) {
      icon = food;
    } else if (types.includes("amusement_park")) {
      icon = amusementPark;
    } else if (types.includes("park")) {
      icon = park;
    } else if (types.includes("store") || types.includes("shopping_mall")) {
      icon = shopping;
    } else if (types.includes('airport')) {
      icon = airport;
    } else if (types.includes("university")) {
      icon = university;
    } else if (types.includes("tourist_attraction")) {
      icon = touristAttraction;
    } else {
      icon = establishment
    }

    var paths = icon.path.map(el => <path d={el} />)
    return (
      <Svg className={clsx(this.props.classes.typeSVG)} viewbox={icon.viewBox}>
        {paths}
      </Svg>
    )
  }

  cellRendererPlace = (cellData) => {
    const classes = this.props.classes;
    const countryCode = cellData.rowData.countryCode;
    return (
      <div>

        <p
          className={clsx(classes.cellText)}
        >
          {cellData.rowData.name} <br />
          {cellData.rowData.address}
        </p>

        {this.generateSVG(cellData.rowData.types)}


        {this.props.context === "Owner" ?
          <OptionsDropdown
            toggleEditForm={this.props.toggleEditForm}
            cellData={cellData}
            handleDelete={this.props.handleDeletePlace}
          /> : null
        }

        {this.props.context === "Owner" && this.props.granularity === 0 ?
          <Svg viewBox={add.viewBox} className={clsx(classes.addSVG)} onClick={() => this.props.toggleUploader(cellData.cellData.pk)}>
            {add.path.map(el => <path d={el} />)}
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
          <svg
            className={clsx(this.props.classes.photoGallerySVG)}
            viewBox="0 0 512 512"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            onClick={(e) => { if (!greyOutGalleryIcon) this.props.onCityGalleryClick(cellData.cellData, e) }}
            value={"KILL"}
          >
            <path
              d={photoGallery1}
              fill={greyOutGalleryIcon ? "444" : "#d4dada"}
              value={"KILL"}
            />
          </svg>
          : null
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


  //TODO implement some sort of throttle to prevent on click map centering from being overwritten by on row mouse over
  render = () => {
    const WIDTH = window.innerWidth * .3;
    //TODO Make this the height of the main component not the whole page
    const HEIGHT = window.innerHeight;
    // console.log(this.props.closestCity)
    const list = this.props.granularity ? this.props.cities : this.getPlaces();
    //this.props.closestCity.distanceFromMapCenter <= 20 ? this.props.places.filter((val) => val.destination === this.props.selectedCity.pk ? true : false) : [];

    const HEADER_HEIGHT = 40;

    return (
      <div className={this.props.classes.container}>

        <Scrollbars
          className={clsx(this.props.classes.scrollBar)}
          onScroll={this.handleScroll}
          renderThumbVertical={obj => this.renderThumb(obj)}

        >
          <Table
            autoHeight
            scrollTop={this.state.scrollTop}
            width={WIDTH * .975}
            height={HEIGHT}
            headerHeight={HEADER_HEIGHT}
            rowHeight={HEIGHT / 5}
            rowCount={list.length}
            rowGetter={({ index }) => list[index]}
            rowClassName={this.getRowClassName}
            onRowMouseOver={(obj) => {
              this.props.changeHoverIndex(obj.rowData.index);
              this.props.changeMapCenter(obj.rowData);
            }}
            onRowMouseOut={() => this.props.changeHoverIndex(null)}
            onRowClick={(obj, e) => {
              this.props.changeMapCenter(obj.rowData);
              this.props.tableRowClick(obj, e)
            }}
          >
            <Column
              label="Destination"
              dataKey="destination"
              width={WIDTH * .975}
              headerStyle={{
                color: "#d4dada"
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
