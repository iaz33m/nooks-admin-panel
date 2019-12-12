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

class CreateProductType extends Component {

  state = {
    name:"",
    isOpen:false
  };

  createProductType = () => {

    let {user,createProductType,dispatch,alertify} = this.props;
    let {name} = this.state;

    createProductType(user.accessToken,name).then(res => {

      dispatch({
        type: actions.CREATE_PRODUCT_TYPES,
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

    const {ability} = this.props;
    if(!ability('productType-create')){
      return <React.Fragment/>
    }

    return (
      <React.Fragment>
        <Button color="success" onClick={this.toggle} className="mr-1">
          <i className="fa fa-plus"/> Create ProductType
        </Button>
        <Modal  isOpen={this.state.isOpen} toggle={this.toggle} className="modal-success">
          <ModalHeader toggle={this.toggle}><i className="fa fa-plus"/> Create ProductType</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="name">ProductType Name</Label>
              <Input type="text" name="name" placeholder="ProductType Name" value={this.state.name} onChange={e => {this.setState({name:e.target.value})}} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.createProductType}>Create</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    createProductType: (token,name) => actions.createProductType(token,name),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateProductType);
