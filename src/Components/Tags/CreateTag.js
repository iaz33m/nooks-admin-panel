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

class CreateTag extends Component {

  state = {
    name:"",
    isOpen:false
  };

  createTag = () => {

    let {user,createTag,dispatch,alertify} = this.props;
    let {name} = this.state;

    createTag(user.accessToken,name).then(res => {

      dispatch({
        type: actions.CREATE_TAGS,
        payload: res.data.data
      });

      alertify.success(res.data.message);

      this.setState({
        name:""
      });

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

    let {ability} = this.props;
    if(!ability('tag-create')){
      return <React.Fragment/>
    }

    return (
      <React.Fragment>
        <Button color="success" onClick={this.toggle} className="mr-1">
          <i className="fa fa-plus"/> Create Tag
        </Button>
        <Modal  isOpen={this.state.isOpen} toggle={this.toggle} className="modal-success">
          <ModalHeader toggle={this.toggle}><i className="fa fa-plus"/> Create Tag</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="name">Tag Name</Label>
              <Input type="text" name="name" placeholder="Tag Name" value={this.state.name} onChange={e => {this.setState({name:e.target.value})}} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.createTag}>Create</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    createTag: (token,name) => actions.createTag(token,name),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateTag);
