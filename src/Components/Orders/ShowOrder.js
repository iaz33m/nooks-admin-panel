import React, {Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/OrderActions";

import {
  FormGroup,
  Input,
  Label,
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,
  Row,
  Col,
  Badge, Card, CardBody, CardFooter, CardHeader, Collapse, Fade,Table
} from 'reactstrap';
import BooleanBadge from "../Common/BooleanBadge";


class ShowOrder extends Component {

  state = {
    isOpen:false
  };

  show = () => {
    let {user,show,id,alertify} = this.props;
    show(user.accessToken,id).then(res => {
      this.setState({
        order:res.data.data
      });
      console.log("Order",res.data.data);
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });
  };

  toggle = () => {

    const {isOpen,order} = this.state;

    this.setState({
      isOpen:!isOpen
    });

    if(!order){
      this.show();
    }
  };

  toggleProductState = (id) => {
    const {order} = this.state;
    const products = order.products.map(p => p.id === id ? {...p,state:!p.state} : {...p});
    this.setState({
      order: {...order,products},
    });
  };

  renderAddOns = (p) => {
    let {addOns} = p;

    if(addOns.length > 0){
      return (
        <React.Fragment>
          <p>Addons</p>
          <Table responsive bordered striped>
            <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {addOns.map(ar => ar.map(a => (
                <tr key={p.name}>
                  <td>{a.name}</td>
                  <td>{a.price}</td>
                </tr>
              )))}
            </tbody>
          </Table>
        </React.Fragment>

      );
    }
  };

  renderOrderDetails = () => {
    const {isPaid,comment,number,products} = this.state.order;
    return (
      <React.Fragment>
        <FormGroup>
          <Row>

            <Col xs="12" sm="6">
              <Label>Special Instructions: </Label>
              <p>{comment}</p>
            </Col>

            <Col xs="12" sm="4">
              <Label htmlFor="number">Contact Number:  </Label> <Badge style={{fontSize:13}} color="primary">{number}</Badge>
            </Col>
            <Col xs="12" sm="2">
              <Label htmlFor="number">Paid:  </Label> <BooleanBadge boolean={isPaid}/>
            </Col>
          </Row>
        </FormGroup>

        {products.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleProductState(p.id)} aria-expanded={!p.state} >
                <Col sm="10">
                  <h6 className="m-0 p-0">{p.name} <Badge color="success"><i className="fa fa-times"/> {p.quantity}</Badge></h6>
                </Col>
              </Button>
            </CardHeader>
            <Collapse isOpen={!p.state}>
              <CardBody>
                <p>{p.instructions}</p>
                {this.renderAddOns(p)}
              </CardBody>
            </Collapse>
          </Card>
        ))}


      </React.Fragment>
    );
  };

  renderOrder = ()=>{
    const {order} = this.state;
    if(!order) {
      return <p>Loading...</p>;
    }
    return this.renderOrderDetails();
  };

  render(){

    let {isOpen} = this.state;

    return (
      <React.Fragment>
        <Button color="success" onClick={this.toggle} className="mr-1">
          <i className="fa fa-eye"/> Details
        </Button>
        <Modal  isOpen={isOpen} toggle={this.toggle} className="modal-success modal-lg">
          <ModalHeader toggle={this.toggle}><i className="fa fa-eye"/> Order Details</ModalHeader>
          <ModalBody>
            {this.renderOrder()}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    show: (token,id) => actions.showOrder(token,id),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ShowOrder);
