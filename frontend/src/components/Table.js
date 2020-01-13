import React, { Component } from 'react';
import {Column, Table} from 'react-virtualized';
import clsx from 'clsx';
import { withStyles} from '@material-ui/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-virtualized/styles.css'; // only needs to be imported once
import "flag-icon-css/css/flag-icon.min.css";
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      images: []
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
    const classes = this.props.classes;
    //TODO Find a better way to pick an image, maybe based on size
    return (
      <div className={clsx(classes.cell)}>
        <span className={clsx(`flag-icon flag-icon-` + cellData.rowData.countryCode, classes.cellFlag)}></span>
        <span>{cellData.rowData.city}, {cellData.rowData.country}</span>
        {cellData.rowData.images.length ? <img className={clsx(classes.cellImage)} src={this.props.backendURL + cellData.rowData.images[0].src}></img> : null}
        <div style={{position: 'absolute', width: 50, top: 10, right: 20}}>
          <FontAwesomeIcon onClick={() => console.log('click')} style={{ width: '100%', height: '100%'}} icon="ellipsis-h"/>
        </div>
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

export default withStyles(styles)(VirtualTable);
 