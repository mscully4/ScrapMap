import React, { Component } from 'react';
import {Column, Table} from 'react-virtualized';
import clsx from 'clsx';
import { withStyles} from '@material-ui/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-virtualized/styles.css'; // only needs to be imported once
import "flag-icon-css/css/flag-icon.min.css";

const styles = theme => ({
  scrollBar: {
    width: "100%",
    height: "100%",
  },
  tableRow: {
    cursor: 'pointer',
    width: "100%",
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
  }
})

class VirtualTable extends Component {
  constructor(props) {
    super(props)
    this.state ={
      scrollTop: 0
    }
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
    //TODO Find a better way to pick an image, maybe based on size
    const img = cellData.rowData.urls.length ? 
      <img style={{width: 100, height: 100}} src={this.props.backendURL + cellData.rowData.urls[0]}></img> :
       null;
    return (
      <div>
        {cellData.rowData.city}, {cellData.rowData.country} <span className={`flag-icon flag-icon-` + cellData.rowData.countryCode}></span>{img}
      </div>
    )
  }

  render = () => {
    const list = this.props.cities;
    const { scrollTop } = this.state;
    const HEIGHT = 400;
    const WIDTH = 700;
    const HEADER_HEIGHT = 40;

    return (
      <Scrollbars
      className={clsx(this.props.classes.scrollBar)}
      onScroll={this.handleScroll}
      >
        <Table
        autoHeight
        scrollTop={scrollTop}
        width={300}
        height={300}
        headerHeight={HEADER_HEIGHT}
        rowHeight={200}
        rowCount={list.length}
        rowGetter={({index}) => list[index]}
        rowClassName={this.getRowClassName}
        onRowMouseOver={(obj) => this.props.changeHoverIndex(obj.rowData.index)}
        onRowMouseOut={(obj) => this.props.changeHoverIndex(null)}
        >
          <Column 
          label="Destination" 
          dataKey="destination" 
          width={300} 
          cellRenderer={this.cellRenderer}
          cellDataGetter={({dataKey, rowData}) => {return rowData}}
          //style={styles.tableRow}
          />
        </Table>
      </Scrollbars>
    )
  }
} 

export default withStyles(styles)(VirtualTable);
 