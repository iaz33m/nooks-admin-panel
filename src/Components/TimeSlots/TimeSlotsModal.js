import React,{Component} from "react";
import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal
} from 'reactstrap';

import TimeSlots from "./TimeSlots";

class TimeSlotsModal extends Component{

  state = {
    isOpen:false,
  };

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };

  render(){

    const {style} = this.props;

    return (
      <React.Fragment>
        <Button style={style} color="primary" onClick={this.toggle} className="mr-1">
          <i className="fa fa-clock-o"/> Update Timeslots
        </Button>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle} className="modal-primary modal-lg">
          <ModalHeader style={{}} toggle={this.toggle}>Set Restaurant Timeslots</ModalHeader>
          <ModalBody>
            <TimeSlots {...this.props}/>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Done</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default TimeSlotsModal;
