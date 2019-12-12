import React, {Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/ProductTypeActions";

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

class EditProductType extends Component {

  state = {
    ...this.props.productType,
    isOpen:false
  };

  editProductType = () => {

    let {user,editProductType,dispatch,alertify} = this.props;
    let productType = {
      id:this.state.id,
      name:this.state.name,
      order:this.state.order
    };

    editProductType(user.accessToken,productType.id,productType).then(res => {

      dispatch({
        type: actions.EDIT_PRODUCT_TYPES,
        payload: productType
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
          <ModalHeader toggle={this.toggle}><i className="fa fa-pencil"/> Edit ProductType</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="name">ProductType Name</Label>
              <Input type="text" name="name" placeholder="ProductType Name" value={this.state.name} onChange={e => {this.setState({name:e.target.value})}} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="order">Display Order</Label>
              <Input type="number" name="order" placeholder="ProductType Order" value={this.state.order} onChange={e => {this.setState({order:e.target.value})}} />
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editProductType}>Edit</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    editProductType: (token,id,data) => actions.editProductType(token,id,data),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(EditProductType);
