import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';

import { place_colors } from "../../utils/colors"
import { pin, pinBase, Svg } from '../../utils/SVGs'
import { ICE_BLUE, FONT_GREY } from '../../utils/colors'


const WIDTH = 20;
const HEIGHT = 20;

const styles = theme => ({
  MarkerContainer: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
  },
  MarkerStyle: {
    cursor: 'pointer',
  },
  Tooltip: {
    position: 'absolute',
    backgroundColor: ICE_BLUE,
    padding: '12px 21px',
    opacity: .9,
    fontSize: 13,
    whiteSpace: "nowrap",
    visibility: "hidden",
    boxShadow: "0 0 10px black",
    borderRadius: 5,
    zIndex: 99999,
    "&:after": {
      position: "absolute",
      content: '""',
      width: 0,
      height: 0,

      borderTopColor: ICE_BLUE,

      borderTopStyle: "Solid",
      borderTopWidth: "6px",

      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      bottom: -6,
      left: "50%",
      marginLeft: -8,
    },
  },
  TooltipShow: {
    visibility: "visible"
  }
})

class Marker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //the data for the destination
      ...this.props.data,

      // editorIsOpen: false,

      //These will change as the map zoom is changed
      tooltipWidth: null,
      tooltipHeight: null,
    }

    this.ref = React.createRef()
  }

  componentDidMount = () => {
    //get the original height and width of the tooltip
    this.setState({
      tooltipWidth: this.ref.current.offsetWidth,
      tooltipHeight: this.ref.current.offsetHeight
    })
  }

  render() {
    const { zoom, data } = this.props
    const scale = ((zoom - 4) / 10);
    const color = this.props.granularity ? data.color : place_colors[data.main_type];
    return (

      <div
        onMouseEnter={(e) => this.props.changeHoverIndex(this.props.data.index)}
        onMouseLeave={(e) => this.props.changeHoverIndex(null)}
        className={clsx(this.props.classes.MarkerContainer)}
        onClick={() => this.props.markerClick(this.props.data)}
        style={{
          //This centers the pin as the zoom level changes
          top: -HEIGHT - (HEIGHT * scale),
          left: (-WIDTH / 2) - ((WIDTH * scale) / 2)
        }}
      >
        <Svg
          style={styles.addIcon}
          viewBox={pin.viewBox}
          className={clsx(this.props.classes.MarkerStyle)}
          style={{
            //The marker is re-sized as the zoom of the map changes
            width: WIDTH + (WIDTH * scale),
            height: HEIGHT + (HEIGHT * scale),
          }}
        >
          <path d={pin.path} fill={this.props.hoverIndex === this.props.data.index ? ICE_BLUE : color}/>
          {/* To have a multi-colored pin, we need to two have two pins, one with the color of the base and the other will a custom color */}
          <path style={{ fill: "Black" }} d={pinBase} />
        </Svg>

        <div
          //Adjustments need to be made to the position of the tooltip as the size of the marker changes.  This formula makes sure the tooltip is always centered
          style={{ left: (-this.state.tooltipWidth / 2) + 10 + (scale * 10), top: (-this.state.tooltipHeight / 2) - 35 - (scale * 5) }}
          ref={this.ref}
          className={clsx(this.props.classes.Tooltip, { [this.props.classes.TooltipShow]: this.props.hoverIndex === this.props.data.index })}
        >
          {this.props.granularity ? <span>{this.props.data.city}, {this.props.data.country}</span> : <span>{this.props.data.name}</span>}
          <br />
          <span>{this.props.granularity ? "Click to View Places" : "Click To View Gallery"}</span>
        </div>

      </div>
    );
  }
}

Marker.propTypes = {
  hoverIndex: PropTypes.number, 
  changeHoverIndex: PropTypes.func,
  data: PropTypes.object,
  lat: PropTypes.number,
  lng: PropTypes.number,
  markerClick: PropTypes.func,
  zoom: PropTypes.number,
  granularity: PropTypes.number,
}

export default withStyles(styles)(Marker);
