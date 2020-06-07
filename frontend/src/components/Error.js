import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { ICE_BLUE, FONT_GREY, OFF_BLACK_1, OFF_BLACK_2, OFF_BLACK_3, OFF_BLACK_4 } from '../utils/colors'
import clsx from 'clsx'
import { withStyles } from '@material-ui/styles';
import RingLoader from "react-spinners/RingLoader";

const styles = theme => ({
  errorText: {
    color: ICE_BLUE,
    fontSize: 24,
    marginLeft: '5%',
    display: 'block'
  },
  modal: {
    backgroundColor: OFF_BLACK_1
  },
  modalHeader: {
    backgroundColor: OFF_BLACK_2,
    color: ICE_BLUE,
    border: "none",
    fontSize: 36,
    // marginBottom: 0
  },
  modalTitle: {
    fontSize: 36,
    marginBottom: 0
  },
  modalBody: {
    backgroundColor: OFF_BLACK_3
  },
  modalFooter: {
    backgroundColor: OFF_BLACK_2,
    border: "none"
  },
})

class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    const classes = this.props.classes
    return (
      <Modal isOpen={this.props.isOpen} className={classes.modal}>
        <ModalHeader className={classes.modalHeader}><p className={classes.modalTitle}>Error</p></ModalHeader>
        <ModalBody className={classes.modalBody}>
          <span className={classes.errorText}>{this.props.error.status}: {this.props.error.statusText}</span>
          {/* <span className={classes.errorText}>Please Refresh The Page</span> */}
        </ModalBody>
      </Modal>
    )
  }
}

export default withStyles(styles)(ErrorMessage);


// LoginForm.propTypes = {
//   handleLogin: PropTypes.func.isRequired
// };