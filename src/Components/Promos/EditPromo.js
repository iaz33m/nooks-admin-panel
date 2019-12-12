import React, {Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/PromoActions";

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
  Col
} from 'reactstrap';

import {generate} from 'voucher-code-generator';
import moment from 'moment';

class EditPromo extends Component {

  state = {
    ...this.props.promo,
    expiry:moment.unix(this.props.promo.expiryDate).format('YYYY-MM-DD'),
    isOpen:false,
    processing:false
  };

  edit = () => {

    this.setState({
      processing:true
    });

    let {user,edit,dispatch,alertify} = this.props;

    let expiry  = moment(this.state.expiry, "YYYY-MM-DD");

    let promo = {
      ...this.state,
      expiry:expiry.unix(),
    };

    edit(user.accessToken,promo.id,promo).then(res => {

      dispatch({
        type: actions.EDIT_PROMO,
        payload: {
          ...promo,
          expiry:expiry.fromNow(),
        }
      });

      alertify.success(res.data.message);

      this.setState({
        isOpen:false
      });

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        processing:false
      });
    });

  };

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  generateCode = () => {
    this.setState({
      code:generate()[0]
    });
  };

  render(){

    let {promoTypes} = this.props;

    return (
      <React.Fragment>
        <Button color="primary" onClick={this.toggle} className="mr-1">
          <i className="fa fa-pencil"/> Edit
        </Button>
        <Modal  isOpen={this.state.isOpen} toggle={this.toggle} className="modal-primary modal-lg">
          <ModalHeader toggle={this.toggle}><i className="fa fa-pencil"/> Edit Tag</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Row>

                <Col xs="12" sm="6">
                  <Label htmlFor="title">Title</Label>
                  <Input type="text" name="title" placeholder="Title" value={this.state.title} onChange={this.onChange} />
                </Col>

                <Col xs="12" sm="6">
                  <Label htmlFor="type">Type</Label>
                  <Input type="select" name="type" onChange={this.onChange} value={this.state.type}>
                    <option value="" key="selectType" >Select Type</option>
                    {promoTypes.map(p => <option key={p.key} value={p.key} >{p.value}</option>)}
                  </Input>
                </Col>

              </Row>

            </FormGroup>

            <FormGroup>
              <Label htmlFor="details">Details</Label>
              <Input type="textarea" name="details" placeholder="Details" value={this.state.details} onChange={this.onChange} />
            </FormGroup>

            <FormGroup>
              <Row>

                <Col xs="12" sm="6">
                  <Label htmlFor="discount">Discount in %</Label>
                  <Input type="number" name="discount" placeholder="Discount in %" value={this.state.discount} onChange={this.onChange} />
                </Col>

                <Col xs="12" sm="3">
                  <Label htmlFor="code">Code</Label>
                  <Input type="text" name="code" placeholder="Code" value={this.state.code} onChange={this.onChange} />
                </Col>

                <Col xs="12" sm="3">
                  <label style={{display:'block'}}>&nbsp;</label>
                  <Button color="success" onClick={this.generateCode}><i className="fa fa-spinner"/> Generate Code </Button>
                </Col>

              </Row>

            </FormGroup>


            <FormGroup>
              <Row>


                <Col xs="12" sm="6">
                  <Label htmlFor="maxAmount">Max Amount</Label>
                  <Input type="number" name="maxAmount" placeholder="Max Amount" value={this.state.maxAmount} onChange={this.onChange} />
                </Col>

                <Col xs="12" sm="6">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input type="date" name="expiry" placeholder="Expiry" value={this.state.expiry} onChange={this.onChange} />
                </Col>

              </Row>

            </FormGroup>


            <FormGroup>
              <Row>



                <Col xs="12" sm="6">
                  <Label htmlFor="points">Points</Label>
                  <Input type="number" name="points" placeholder="Points" value={this.state.points} onChange={this.onChange} />
                </Col>

              </Row>

            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.edit} disabled={this.state.processing}>
              {(this.state.processing)?"Editing...":"Edit"}
            </Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    edit: (token,id,params) => actions.editPromo(token,id,params),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(EditPromo);
