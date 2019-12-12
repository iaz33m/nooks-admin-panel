import React, {Component} from "react";

import {
  FormGroup,
  Input,
  Label,Table,Button,Col,Row
} from 'reactstrap';

class AddonForm extends Component {

  state = {
    ...this.props,
    opName:"",
    opPrice:"",
  };

  onChange = e => {
    let state = {
      ...this.state,
      [e.target.name]: e.target.value
    };
    this.changeState(state);
  };

  changeState = state => {
    this.setState(state);
    const {onChange} = this.props;
    onChange(state);
  };

  deleteOption = (index) => {
    let state = {
      ...this.state,
      options:this.state.options.filter((o,i)=>i!==index)
    };
    this.changeState(state);
  };

  addOption = () => {
    let {opName:name,opPrice:price} = this.state;
    price = parseInt(price);
    let state = {
      ...this.state,
      options:[...this.state.options,{name,price}],
      opName:"",
      opPrice:""
    };
    this.changeState(state);
  };

  renderOptions = () => {

    const {options} = this.state;

    if(options.length > 0){
      return (
        <FormGroup>
          <p>Options</p>
          <Table responsive bordered striped>
            <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {options.map((o,i) => (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{o.name}</td>
                <td>{o.price}</td>
                <td>
                  <Button color="link" className="text-danger" onClick={()=>this.deleteOption(i)}>
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
    const {name,isMultiSelectable,opName,opPrice} = this.state;

    return (
      <React.Fragment>
        <FormGroup>
          <Label htmlFor="name">Name*</Label>
          <Input type="text" name="name" placeholder="Name" value={name} onChange={this.onChange} />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="isVeg">Multi Select*</Label>
          <Input type="select" name="isMultiSelectable" onChange={this.onChange} value={isMultiSelectable}>
            <option value="1" key="1" >Yes</option>
            <option value="0" key="0" >No</option>
          </Input>
        </FormGroup>

        {this.renderOptions()}

        <FormGroup>
          <Row>
            <Col xs="12" sm="4">
              <Input type="text" name="opName" placeholder="Name" value={opName} onChange={this.onChange} />
            </Col>
            <Col xs="12" sm="4">
              <Input  type="text" name="opPrice" placeholder="Price" value={opPrice} onChange={this.onChange} />
            </Col>
            <Col xs="12" sm="4">
              <Button block className="warning" onClick={this.addOption}><i className="fa fa-plus"/> Add Option</Button>
            </Col>
          </Row>

        </FormGroup>

      </React.Fragment>
    );
  }
}


export default AddonForm
