import React, { Component } from 'react';
import {Column, Table} from 'react-virtualized';
import clsx from 'clsx';
import { withStyles} from '@material-ui/styles';
import 'react-virtualized/styles.css'; // only needs to be imported once

const styles = theme => ({
  tableRow: {
    cursor: 'pointer',
    backgroundColor: '#ffff00',
    width: "100%",
    height: "100%",
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: "#00ffff",
      color: "red"
    }
  }
})

class VirtualTable extends Component {
  constructor(props) {
    super(props)
    this.state ={

    }
  }

  getRowClassName = ({index}) => {
    const classes = this.props.classes;
    return clsx(classes.tableRow, classes.tableRowHover)
  }

  getRowStyling = () => {
    console.log(1)
  }

  cellRenderer = (cellData) => {
    //console.log(cellData)
    return (
      <div>{cellData.rowData.city}, {cellData.rowData.country}</div>
    )
  }

  render = () => {
    const list = this.props.cities;
    console.log(this.props)
    //   {city: 'Dublin', country: 'Ireland'},
    //   {city: "Budapest", country: 'Hungary'}
    //   // And so on...
    // ];
    return (
      <Table
      width={300}
      height={300}
      headerHeight={20}
      rowHeight={200}
      rowCount={list.length}
      rowGetter={({index}) => list[index]}
      rowClassName={this.getRowClassName}
      >
      <Column 
        label="Destination" 
        dataKey="destination" 
        width={300} 
        cellRenderer={this.cellRenderer}
        cellDataGetter={({dataKey, rowData}) => {return rowData}}
        //style={styles.tableRow}
      />
    </Table>)
      }
} 

export default withStyles(styles)(VirtualTable);
 