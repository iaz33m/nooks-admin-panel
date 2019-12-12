import React, {Component} from "react";

import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal
} from 'reactstrap';

import AddonForm from "./AddonForm";

class EditAddon extends Component {

  state = {
    ...this.props.addon,
    isMultiSelectable:(this.props.isMultiSelectable)?"1":"0",
    options:(this.props.addon.options)?this.props.addon.options:[],
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
    });
  };

  edit = (state) => {
    const {editAddOn,index} = this.props;
    const {name,isMultiSelectable,options} = state;
    editAddOn({index,name,isMultiSelectable,options});
  };

  done = () => {
    this.toggle();
    this.edit(this.state);
  };

  render(){
    const {isOpen} = this.state;

    return (
      <React.Fragment>
        <Button color="link" className="text-primary" onClick={this.toggle} ><i className="fa fa-pencil"/></Button>
        <Modal  isOpen={isOpen} toggle={this.toggle} className="modal-primary">
          <ModalHeader toggle={this.toggle}><i className="fa fa-plus"/> Edit Addon</ModalHeader>
          <ModalBody>
            <AddonForm {...this.state} onChange={this.onChange} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.done}>Done</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default EditAddon;
