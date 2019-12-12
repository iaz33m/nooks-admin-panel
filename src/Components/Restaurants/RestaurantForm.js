import React, {Component} from "react";

import {
  Row,Col,Label,Input,FormGroup
} from 'reactstrap';

import {can} from '../../util/functions'

class RestaurantForm extends Component {

  state = {
    ...this.props
  };

  onChange = e => {
    const {onChange} = this.props;
    this.setState({
      [e.target.name]: e.target.value
    });
    onChange(e);
  };

  ability = p => {
    let {permissions:prs} = this.props;
    return can(p,prs);
  };

  renderStatusInput = () => {
    const {forEdit,statuses} = this.props;
    if(forEdit){
      if(this.ability('restaurant-edit-all')){
        return (
          <Col xs="12" sm="3">
            <Label htmlFor="type">Status*</Label>
            <Input type="select" name="status" onChange={this.onChange} value={this.state.status}>
              {statuses.map(p => <option key={p.key} value={p.key} >{p.value}</option>)}
            </Input>
          </Col>
        );
      }
    }
  };

  render () {
    return (
      <React.Fragment>
        <FormGroup>
          <Row>
            <Col xs="12" sm="6">
              <Label htmlFor="name">Name*</Label>
              <Input type="text" name="name" placeholder="Name" value={this.state.name} onChange={this.onChange} />
            </Col>
            <Col xs="12" sm="3">
              <Label htmlFor="type">Veg Only*</Label>
              <Input type="select" name="isVeg" onChange={this.onChange} value={this.state.isVeg}>
                <option value="0" >No</option>
                <option value="1" >Yes</option>
              </Input>
            </Col>

            {this.renderStatusInput()}

          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col xs="12" sm="6">
              <Label htmlFor="description">Description</Label>
              <Input type="textarea" name="description" placeholder="Description" value={this.state.description} onChange={this.onChange} />
            </Col>
            <Col xs="12" sm="6">
              <Label htmlFor="about">About</Label>
              <Input type="textarea" name="about" placeholder="About" value={this.state.about} onChange={this.onChange} />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col xs="12" sm="6">
              <Label htmlFor="delivery_time">Delivery Time*</Label>
              <Input type="number" name="delivery_time" placeholder="e.g 20" value={this.state.delivery_time} onChange={this.onChange} />
            </Col>
            <Col xs="12" sm="6">
              <Label htmlFor="min_delivery">Min delivery*</Label>
              <Input type="number" name="min_delivery" placeholder="e.g 250" value={this.state.min_delivery} onChange={this.onChange} />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col xs="12" sm="6">
              <Label htmlFor="delivery_fee">Delivery fee*</Label>
              <Input type="number" name="delivery_fee" placeholder="e.g 50" value={this.state.delivery_fee} onChange={this.onChange} />
            </Col>
            <Col xs="12" sm="6">
              <Label htmlFor="free_delivery_price">Free Delivery Over*</Label>
              <Input type="number" name="free_delivery_price" placeholder="e.g 400" value={this.state.free_delivery_price} onChange={this.onChange} />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col xs="12" sm="12">
              <Label htmlFor="address">Address*</Label>
              <Input type="textarea" name="address" placeholder="Address" value={this.state.address} onChange={this.onChange} />
            </Col>
          </Row>
        </FormGroup>
      </React.Fragment>
    );
  }

}

export default RestaurantForm;
