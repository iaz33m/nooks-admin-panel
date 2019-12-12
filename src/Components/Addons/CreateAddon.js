import React, {Component} from "react";

import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal
} from 'reactstrap';

import AddonForm from "./AddonForm";

class CreateAddon extends Component {

  initState = {
    name:"",
    isMultiSelectable:"0",
    options:[],
  };

  state = {
    ...this.initState,
    isOpen:false,
  };

  onChange = state => {
    this.setState({
      ...state
    });
  };

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };

  add = () => {
    const {addAddOn} = this.props;
    const {name,isMultiSelectable,options} = this.state;
    addAddOn({name,isMultiSelectable,options});
    this.setState({
      ...this.initState,
      isOpen:false,
    });
  };

  render(){
    const {isOpen} = this.state;
    return (
      <React.Fragment>
        <Button block color="success" onClick={this.toggle} className="mr-1"><i className="fa fa-plus"/> Add Addon</Button>
        <Modal  isOpen={isOpen} toggle={this.toggle} className="modal-success">
          <ModalHeader toggle={this.toggle}><i className="fa fa-plus"/> Add Addon</ModalHeader>
          <ModalBody>
            <AddonForm {...this.state} onChange={this.onChange} />
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.add}>Add</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateAddon
