import React, {Component} from "react";
import { connect } from "react-redux";
import {
  FormGroup,
  Input,
  Label,Row,Col,Table,Button
} from 'reactstrap';

import BooleanBadge from "../Common/BooleanBadge";
import CreateAddon from "../Addons/CreateAddon";
import EditAddon from "../Addons/EditAddon";

class ProductForm extends Component {

  state = {
    ...this.props
  };

  onChange = e => {
    let state = {
      ...this.state,
      [e.target.name]: e.target.value
    };
    this.changeState(state);
  };

  changeState = s => {
    this.setState(s);
    const {onChange} = this.props;
    onChange(s);
  };

  renderOrderField = (order) => {
    if(order!==undefined ){
      return (
        <Col xs="12" sm="4">
        <FormGroup>
          <Label htmlFor="order">Order*</Label>
          <Input type="text" name="order" placeholder="Order" value={order} onChange={this.onChange} />
        </FormGroup>
        </Col>
      );
    }
  };

  addAddOn = a => {
    let state = {
      ...this.state,
      addOns:[...this.state.addOns,a]
    };
    this.changeState(state);
  };

  editAddOn = addon => {
    let state = {
      ...this.state,
      addOns:this.state.addOns.map((a,i) => (i === addon.index)? {...addon}:{...a} )
    };

    this.changeState(state);
  };

  deleteAddOn = index => {
    let state = {
      ...this.state,
      addOns:this.state.addOns.filter((a,i)=>i!==index)
    };
    this.changeState(state);
  };

  renderAddOns = () => {

    const {addOns} = this.state;

    if(addOns.length > 0){
      return (
        <FormGroup>
          <p>Addons</p>
          <Table responsive bordered striped>
            <thead>
            <tr>
              <th>Name</th>
              <th>Multi Select</th>
              <th>Options</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {addOns.map((a,i) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td><BooleanBadge boolean={a.isMultiSelectable}/></td>
                <td>{(a.options)?a.options.length:"0"}</td>
                <td>
                  <EditAddon addon={a} index={i} editAddOn={this.editAddOn}/>
                  <Button color="link" className="text-danger" onClick={()=>this.deleteAddOn(i)}>
                    <i className="fa fa-trash"/>
                  </Button>
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        </FormGroup>

      );
    }
  };

  render(){
    const {name,description,price,discount,isVeg,isDeal,isFamous,prep_time,type_id,order} = this.state;
    const {productTypes} = this.props;
    return (
      <React.Fragment>

        <FormGroup>
          <Row>
            <Col xs="12" sm="4">
              <FormGroup>
                <Label htmlFor="name">Name*</Label>
                <Input type="text" name="name" placeholder="Name" value={name} onChange={this.onChange} />
              </FormGroup>
            </Col>
            <Col xs="12" sm="4">
              <FormGroup>
                <Label htmlFor="price">Price*</Label>
                <Input type="number" name="price" placeholder="Price" value={price} onChange={this.onChange} />
              </FormGroup>
            </Col>
            <Col xs="12" sm="4">
              <FormGroup>
                <Label htmlFor="discount">Discount*</Label>
                <Input type="number" name="discount" placeholder="Discount" value={discount} onChange={this.onChange} />
              </FormGroup>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col xs="12" sm="4">
              <FormGroup>
                <Label htmlFor="isDeal">Deal*</Label>
                <Input type="select" name="isDeal" onChange={this.onChange} value={isDeal}>
                  <option value="" key="all" >Select</option>
                  <option value="1" key="1" >Yes</option>
                  <option value="0" key="0" >No</option>
                </Input>
              </FormGroup>
            </Col>
            <Col xs="12" sm="4">
              <FormGroup>
                <Label htmlFor="isVeg">Veg Only*</Label>
                <Input type="select" name="isVeg" onChange={this.onChange} value={isVeg}>
                  <option value="" key="all" >Select</option>
                  <option value="1" key="1" >Yes</option>
                  <option value="0" key="0" >No</option>
                </Input>
              </FormGroup>
            </Col>
            <Col xs="12" sm="4">
              <FormGroup>
                <Label htmlFor="isFamous">Famous*</Label>
                <Input type="select" name="isFamous" onChange={this.onChange} value={isFamous}>
                  <option value="" key="all" >Select</option>
                  <option value="1" key="1" >Yes</option>
                  <option value="0" key="0" >No</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col xs="12" sm="4">
              <FormGroup>
                <Label htmlFor="prep_time">Prep Time*</Label>
                <Input type="number" name="prep_time" placeholder="Prep Time" value={prep_time} onChange={this.onChange} />
              </FormGroup>
            </Col>
            <Col xs="12" sm="4">
              <FormGroup>
                <Label htmlFor="type_id">Product Type</Label>
                <Input type="select" name="type_id" onChange={this.onChange} value={type_id}>
                  <option value="" key="all" >Select</option>
                  {productTypes.map(p => <option key={p.id} value={p.id} >{p.name}</option>)}
                </Input>
              </FormGroup>
            </Col>
            {this.renderOrderField(order)}
          </Row>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description*</Label>
          <Input type="textarea" name="description" placeholder="Description" value={description} onChange={this.onChange} />
        </FormGroup>

        {this.renderAddOns()}

        <FormGroup>
          <CreateAddon addAddOn={this.addAddOn}/>
        </FormGroup>

      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    productTypes: state.metaData.productTypes,
  };
};
export default connect(
  mapStateToProps
)(ProductForm);
