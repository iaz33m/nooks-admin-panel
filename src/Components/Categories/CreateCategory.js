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

class CreateCategory extends Component {

  state = {
    name:"",
    description:"",
    isDeal:"",
    rest_id:this.props.rest_id,
    creating:false,
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


  create = () => {

    this.setState({
      creating:true
    });

    let {user,create,dispatch,alertify} = this.props;
    let params = {...this.state};

    create(user.accessToken,params).then(res => {

      dispatch({
        type: actions.CREATE_CATEGORY,
        payload: {
          rest_id:params.rest_id,
          category:res.data.data,
        }
      });

      this.setState({
        name:"",
        description:"",
        isDeal:"",
        isOpen:false
      });

      alertify.success(res.data.message);

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        creating:false
      });
    });

  };

  render(){
    const {isOpen,creating} = this.state;

    return (
      <React.Fragment>

        <Button block color="default" onClick={this.toggle} className="mr-1"><i className="fa fa-plus"/> Add Menu</Button>

        <Modal  isOpen={isOpen} toggle={this.toggle} className="modal-default">
          <ModalHeader toggle={this.toggle}><i className="fa fa-plus"/> Add Menu</ModalHeader>
          <ModalBody>
            <CategoryForm {...this.props} {...this.state} onChange={this.onChange}/>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.create}>{(creating)?"Creating...":"Create"}</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    create: (token,params) => actions.createCategory(token,params),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateCategory);
