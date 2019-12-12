import React, {Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/TagActions";

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

class EditTag extends Component {

  state = {
    ...this.props.tag,
    isOpen:false
  };

  editTag = () => {

    let {user,editTag,dispatch,alertify} = this.props;
    let tag = {
      id:this.state.id,
      name:this.state.name,
      order:this.state.order
    };

    editTag(user.accessToken,tag.id,tag).then(res => {

      dispatch({
        type: actions.EDIT_TAGS,
        payload: tag
      });

      alertify.success(res.data.message);

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });

    this.setState({
      isOpen:false
    });

  };

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };

  render(){

    return (
      <React.Fragment>
        <Button color="primary" onClick={this.toggle} className="mr-1">
          <i className="fa fa-pencil"/> Edit
        </Button>
        <Modal  isOpen={this.state.isOpen} toggle={this.toggle} className="modal-primary">
          <ModalHeader toggle={this.toggle}><i className="fa fa-pencil"/> Edit Tag</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="name">Tag Name</Label>
              <Input type="text" name="name" placeholder="Tag Name" value={this.state.name} onChange={e => {this.setState({name:e.target.value})}} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="order">Display Order</Label>
              <Input type="number" name="order" placeholder="Tag Order" value={this.state.order} onChange={e => {this.setState({order:e.target.value})}} />
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editTag}>Edit</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    editTag: (token,id,data) => actions.editTag(token,id,data),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(EditTag);
