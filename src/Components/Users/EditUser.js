import React, {Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/UserActions";

import {
  FormGroup,
  Input,
  Label,
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal, Row, Col
} from 'reactstrap';

class EditUser extends Component {

  state = {
    ...this.props.u,
    isOpen:false,
    editing:false
  };

  editUser = () => {

    this.setState({
      editing:true
    });

    let {user,editUser,dispatch,alertify} = this.props;
    let data = {...this.state};

    editUser(user.accessToken,data.id,data).then(res => {

      dispatch({
        type: actions.EDIT_USER,
        payload: data
      });

      this.setState({
        isOpen:false
      });

      alertify.success(res.data.message);

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        editing:false
      });
    });

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

  render(){

    return (
      <React.Fragment>
        <Button color="primary" onClick={this.toggle} className="mr-1">
          <i className="fa fa-pencil"/> Edit
        </Button>
        <Modal  isOpen={this.state.isOpen} toggle={this.toggle} className="modal-primary modal-lg">
          <ModalHeader toggle={this.toggle}><i className="fa fa-pencil"/> Edit User</ModalHeader>
          <ModalBody>

            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input type="text" name="name" placeholder="Name" value={this.state.name} onChange={this.onChange} />
            </FormGroup>

            <FormGroup>

              <Row>
                <Col xs="12" sm="6">
                  <Label htmlFor="numberVerified">Number Verified</Label>
                  <Input type="select" name="numberVerified" onChange={this.onChange} value={this.state.numberVerified}>
                    <option value="1" key="1" >Yes</option>
                    <option value="0" key="0" >No</option>
                  </Input>
                </Col>
                <Col xs="12" sm="6">
                  <Label htmlFor="isActive">Active</Label>
                  <Input type="select" name="isActive" onChange={this.onChange} value={this.state.isActive}>
                    <option value="1" key="1" >Yes</option>
                    <option value="0" key="0" >No</option>
                  </Input>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="address">Address</Label>
              <Input type="textarea" name="address" placeholder="Address" value={(this.state.address)?this.state.address:""} onChange={this.onChange} />
            </FormGroup>

            <FormGroup>
            <Label>Number</Label>
                  <Input type="number" name="number" placeholder="Number" onChange={this.onChange} value={this.state.number}  />
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editUser}>{(this.state.editing)?"Updating...":"Update"}</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    editUser: (token,id,data) => actions.editUser(token,id,data),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(EditUser);
