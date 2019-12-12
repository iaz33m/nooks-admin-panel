import React, {Component} from "react";

import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,Input
} from 'reactstrap';

import moment from 'moment';

class EditOrderPickupTime extends Component {

  state = {
    isOpen:false,
    pickup_time:moment.unix(this.props.pickup).format('YYYY-MM-DDTHH:mm:ss')
  };

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  editPrepTime = () => {
    const {edit,id} = this.props;
    let {pickup_time} = this.state;
    pickup_time = moment(pickup_time, "YYYY-MM-DDTHH:mm:ss").unix();
    edit(id,{
      pickup_time
    });
    this.toggle();
  };

  render(){
    const {isOpen,pickup_time,} = this.state;
    return (
      <React.Fragment>
        <Button  color="link" onClick={this.toggle}><i className="fa fa-pencil"/></Button>
        <Modal  isOpen={isOpen} toggle={this.toggle} className="modal-primary">
          <ModalHeader toggle={this.toggle}><i className="fa fa-pencil"/> Order Pickup Time</ModalHeader>
          <ModalBody>
            <Input type="datetime-local" name="pickup_time" placeholder="Pickup Time" value={pickup_time} onChange={this.onChange} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editPrepTime}><i className="fa fa-pencil"/> Update</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default EditOrderPickupTime;
