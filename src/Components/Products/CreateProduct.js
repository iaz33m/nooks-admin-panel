import React, {Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/ProductActions";

import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal
} from 'reactstrap';

import ProductForm from "./ProductForm";

class CreateProduct extends Component {

  initSate = {
    name:"",description:"",price:"",discount:"",isVeg:"",isDeal:"",isFamous:"",prep_time:"",
    addOns:[],
    media_id:"0",
    type_id:"",
    rest_id:this.props.rest_id,
    categories:[this.props.cat_id],
  };

  state = {
    ...this.initSate,
    creating:false,
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

  create = () => {

    this.setState({
      creating:true
    });

    let {user,create,dispatch,alertify} = this.props;
    let params = {...this.state};

    create(user.accessToken,params).then(res => {

      dispatch({
        type: actions.CREATE_PRODUCT,
        payload: {
          cat_id:this.props.cat_id,
          product:res.data.data,
        }
      });

      this.setState({
        ...this.initSate,
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
        <Button block color="success" onClick={this.toggle} className="mr-1"><i className="fa fa-plus"/> Add Product</Button>
        <Modal  isOpen={isOpen} toggle={this.toggle} className="modal-success modal-lg">
          <ModalHeader toggle={this.toggle}><i className="fa fa-plus"/> Add Product</ModalHeader>
          <ModalBody>
            <ProductForm {...this.props} {...this.state} onChange={this.onChange} />
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
    create: (token,params) => actions.createProduct(token,params),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateProduct);
