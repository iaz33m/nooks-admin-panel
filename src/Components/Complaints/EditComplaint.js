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

class EditComplaint extends Component {

  state = {
    ...this.props.complaint,
    isOpen: false
  };

  editComplaint = () => {

    let { user, editComplaint, dispatch, alertify } = this.props;
    let complaint = {
      id: this.state.id,
      description: this.state.description,
      type: this.state.type,
      status: this.state.status
    };

    editComplaint(user.accessToken, complaint.id, complaint).then(res => {

      dispatch({
        type: actions.EDIT_COMPLAINTS,
        payload: complaint
      });

      alertify.success(res.data.message);

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

    return (
      <React.Fragment>
        <Button color="primary" onClick={this.toggle} className="mr-1">
          <i className="fa fa-pencil" /> Edit
        </Button>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle} className="modal-primary">
          <ModalHeader toggle={this.toggle}><i className="fa fa-pencil" /> Edit Tag</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <Input type="text" name="description" placeholder="Description" value={this.state.description} onChange={e => { this.setState({ description: e.target.value }) }} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="type">Type</Label>
              <select className='form-control' name="type" placeholder="Type" value={this.state.type} onChange={e => { this.setState({ type: e.target.value }) }} >
                <option value='complain'>Complain</option>
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

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editComplaint}>Edit</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    editComplaint: (token, id, data) => actions.editComplaint(token, id, data),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(EditComplaint);
