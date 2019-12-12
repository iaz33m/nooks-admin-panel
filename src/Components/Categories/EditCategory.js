import React, {Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/CategoryActions";

import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal
} from 'reactstrap';

import CategoryForm from "./CategoryForm";

class EditCategory extends Component {

  state = {
    ...this.props.category,
    isDeal:(this.props.category.isDeal)?"1":"0",
    rest_id:this.props.rest_id,
    processing:false,
    isOpen:false,
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


  edit = () => {

    this.setState({
      processing:true
    });

    let {user,edit,dispatch,alertify} = this.props;
    let params = {...this.state};

    edit(user.accessToken,params.id,params).then(res => {

      dispatch({
        type: actions.EDIT_CATEGORY,
        payload: {
          rest_id:params.rest_id,
          category:res.data.data,
        }
      });

      this.setState({
        isOpen:false
      });

      alertify.success(res.data.message);
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        processing:false
      });
    });

  };

  render(){
    const {isOpen,processing} = this.state;

    return (
      <React.Fragment>

        <Button color="link" onClick={this.toggle}><i className="fa fa-pencil"/></Button>

        <Modal  isOpen={isOpen} toggle={this.toggle} className="modal-primary">
          <ModalHeader toggle={this.toggle}><i className="fa fa-pencil"/> Edit Menu</ModalHeader>
          <ModalBody>
            <CategoryForm {...this.props} {...this.state} onChange={this.onChange}/>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.edit}>{(processing)?"Updating...":"Update"}</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    edit: (token,id,params) => actions.editCategory(token,id,params),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(EditCategory);
