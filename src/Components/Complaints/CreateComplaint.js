import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/ComplaintActions";

import {
  FormGroup,
  Input,
  Label,
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal
} from 'reactstrap';

class CreateComplaint extends Component {

  state = {
    name: '',
    description: '',
    type: '',
    status: '',
    nook_id: '',
    isOpen: false
  };

  createComplaint = () => {

    let { user, createComplaint, dispatch, alertify } = this.props;
    let { description, type, status, nook_id } = this.state;

    let params = {
      description,
      type,
      status,
      nook_id,
      user_id: user.id
    }

    createComplaint(user.accessToken, params).then(res => {

      dispatch({
        type: actions.CREATE_COMPLAINTS,
        payload: res.data.data
      });

      alertify.success(res.data.message);

      this.setState({
        name: '',
        description: '',
        type: '',
        status: '',
        nook_id: '',
      });

    }).catch(({ response }) => {
      alertify.alert('Error ' + response.status + ' - ' + response.statusText, response.data.message);
    });

    this.setState({
      isOpen: false
    });

  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  };

  render() {

    let { ability } = this.props;
    if (!ability('complaint-create')) {
      return <React.Fragment />
    }

    return (
      <React.Fragment>
        <Button color="success" onClick={this.toggle} className="mr-1">
          <i className="fa fa-plus" /> Create Complaint
        </Button>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle} className="modal-success">
          <ModalHeader toggle={this.toggle}><i className="fa fa-plus" /> Create Tag</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <Input type="text" name="description" placeholder="Description" value={this.state.description} onChange={e => { this.setState({ description: e.target.value }) }} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="type">Type</Label>
              <select className='form-control' name="type" placeholder="Type" value={this.state.type} onChange={e => { this.setState({ type: e.target.value }) }} >
                <option value='complain'>Complain</option>
                <option value='complain2'>Complain 2</option>
              </select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="status">Status</Label>
              <select className='form-control' name="status" placeholder="Status" value={this.state.status} onChange={e => { this.setState({ status: e.target.value }) }} >
                <option value='pending'>Pending</option>
                <option value='in progress'>In Progress</option>
                <option value='approved'>Approved</option>
                <option value='canceled'>Canceled</option>
              </select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="nook_id">Nook</Label>
              <select className='form-control' name="nook_id" placeholder="Select Nook" value={this.state.nook_id} onChange={e => { this.setState({ nook_id: e.target.value }) }} >
                <option value='1'>Nook 1</option>
                <option value='2'>Nook 2</option>
              </select>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.createComplaint}>Create</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    createComplaint: (token, data) => actions.createComplaint(token, data),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateComplaint);
