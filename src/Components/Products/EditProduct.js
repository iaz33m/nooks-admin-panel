import React, {Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/ProductActions";

import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,ListGroupItem,ListGroupItemHeading,ListGroupItemText,Badge,
} from 'reactstrap';
import ProductForm from "./ProductForm";

class EditProduct extends Component {

  state = {
    ...this.props.product,
    isDeal:(this.props.product.isDeal)?"1":"0",
    isVeg:(this.props.product.isVeg)?"1":"0",
    isFamous:(this.props.product.isFamous)?"1":"0",
    rest_id:this.props.rest_id,
    categories:[this.props.cat_id],
    processing:false,
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


  edit = () => {

    this.setState({
      processing:true
    });

    let {user,edit,dispatch,alertify} = this.props;
    let params = {...this.state};

    edit(user.accessToken,params.id,params).then(res => {

      dispatch({
        type: actions.EDIT_PRODUCT,
        payload: {
          cat_id:this.props.cat_id,
          product:res.data.data,
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

  renderEditProductBtn = ()=>{
    const {ability} = this.props;
    if(ability('product-edit')){
      return (
        <Button color="link" onClick={this.toggle}><i className="fa fa-pencil"/></Button>
      );
    }
  };

  render(){

    const {isOpen,processing,name,description,price} = this.state;
    return (
      <React.Fragment>

        <ListGroupItem >
          <ListGroupItemHeading>{name} - <Badge color="warning">Rs.{price}</Badge>
            {this.renderEditProductBtn()}
          </ListGroupItemHeading>
          <ListGroupItemText>{description}</ListGroupItemText>
        </ListGroupItem>

        <Modal  isOpen={isOpen} toggle={this.toggle} className="modal-primary modal-lg">
          <ModalHeader toggle={this.toggle}><i className="fa fa-pencil"/> Edit Product</ModalHeader>
          <ModalBody>
            <ProductForm {...this.props} {...this.state} onChange={this.onChange}/>
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
    edit: (token,id,params) => actions.editProduct(token,id,params),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(EditProduct);
