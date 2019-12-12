import React, {Component} from "react";

import {
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

class CategoryForm extends Component {

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

  renderOrderField = (order) => {
    if(order!==undefined ){
      return (
        <FormGroup>
          <Label htmlFor="order">Order*</Label>
          <Input type="text" name="order" placeholder="Order" value={order} onChange={this.onChange} />
        </FormGroup>
      );
    }
  };

  render(){
    const {name,description,isDeal,order} = this.state;
    return (
      <React.Fragment>
        <FormGroup>
          <Label htmlFor="name">Name*</Label>
          <Input type="text" name="name" placeholder="Name" value={name} onChange={this.onChange} />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="isDeal">Deal*</Label>
          <Input type="select" name="isDeal" onChange={this.onChange} value={isDeal}>
            <option value="" key="all" >Select</option>
            <option value="1" key="1" >Yes</option>
            <option value="0" key="0" >No</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description*</Label>
          <Input type="textarea" name="description" placeholder="Description" value={description} onChange={this.onChange} />
        </FormGroup>

        {this.renderOrderField(order)}

      </React.Fragment>
    );
  }
}

export default CategoryForm;
