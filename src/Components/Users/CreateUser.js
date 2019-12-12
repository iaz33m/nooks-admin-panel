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
  Modal
} from 'reactstrap';

class CreateUser extends Component {

  state = {
    name:"",
    number:"",
    password:"",
    isOpen:false,
    creating:false,
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };


  createUser = () => {

    this.setState({
      creating:true
    });

    let {createUser,dispatch,alertify} = this.props;
    let params = {...this.state};

    createUser(params).then(res => {

      dispatch({
        type: actions.CREATE_USER,
        payload: res.data.user
      });

      alertify.success("User Created Successfully");

      this.setState({
        name:"",
        number:"",
        password:""
      });

      this.setState({
        isOpen:false
      });

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        creating:false
      });
    });

  };

  render(){
    const {isOpen,name,number,password,creating} = this.state;
    const {label} = this.props;
    return (
      <React.Fragment>
        <Button color="success" onClick={this.toggle} className="mr-1">
          <i className="fa fa-plus"/> {label}
        </Button>
        <Modal  isOpen={isOpen} toggle={this.toggle} className="modal-success">
          <ModalHeader toggle={this.toggle}><i className="fa fa-plus"/> {label}</ModalHeader>
          <ModalBody>

            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input type="text" name="name" placeholder="Name" value={name} onChange={this.onChange} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="number">Number</Label>
              <Input type="number" name="number" placeholder="Number" value={number} onChange={this.onChange} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" placeholder="Password" value={password} onChange={this.onChange} />
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.createUser}>{(creating)?"Creating...":"Create"}</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    createUser: (data) => actions.createUser(data),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateUser);
