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
  Modal, Row, Col
} from 'reactstrap';

import {generate} from 'voucher-code-generator';
import moment from 'moment';



import RestaurantSelect from "../Restaurants/RestaurantSelect";
class CreatePromo extends Component {

  initState = {
    title:"",
    details:"",
    type:"",
    code:"",
    discount:"",
    maxAmount:"",
    expiry:moment().format('YYYY-MM-DD'),
    points:"",
    rest_id:0,
    isOpen:false,
    processing:false
  };

  state = {
    ...this.initState
  };

  create = () => {

    this.setState({
      processing:true
    });

    let {user,create,dispatch,alertify} = this.props;

    let expiry  = moment(this.state.expiry, "YYYY-MM-DD").unix();

    let params = {...this.state,expiry};

    create(user.accessToken,params).then(res => {

      dispatch({
        type: actions.CREATE_PROMO,
        payload: res.data.data
      });

      alertify.success(res.data.message);

      this.setState({
        ...this.initState,
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

  onRestaurantChange = id => {
    this.setState({
      rest_id:id
    });
  };

  generateCode = () => {

    this.setState({
      code:generate()[0]
    });
  };

  componentWillMount(){
    this.generateCode();
  }


  render(){

    const {ability,promoTypes} = this.props;
    if(!ability('promo-create')){
      return <React.Fragment/>
    }

    return (
      <React.Fragment>
        <Button color="success" onClick={this.toggle} className="mr-1">
          <i className="fa fa-plus"/> Create Promo
        </Button>
        <Modal  isOpen={this.state.isOpen} toggle={this.toggle} className="modal-success modal-lg">
          <ModalHeader toggle={this.toggle}><i className="fa fa-plus"/> Create Promo</ModalHeader>
          <ModalBody>

            <FormGroup>
              <Row>
                <Col xs="12" sm="6">
                  <Label htmlFor="title">Title</Label>
                  <Input type="text" name="title" placeholder="Title" value={this.state.title} onChange={this.onChange} />
                </Col>
                <Col xs="12" sm="6">
                  <Label htmlFor="title">Restaurant</Label>
                  <RestaurantSelect {...this.props} onChange={this.onRestaurantChange}/>
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
                  <Label htmlFor="type">Type</Label>
                  <Input type="select" name="type" onChange={this.onChange} value={this.state.type}>
                    <option value="" key="selectType" >Select Type</option>
                    {promoTypes.map(p => <option key={p.key} value={p.key} >{p.value}</option>)}
                  </Input>
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
                  <Label htmlFor="discount">Discount in %</Label>
                  <Input type="number" name="discount" placeholder="Discount in %" value={this.state.discount} onChange={this.onChange} />
                </Col>

                <Col xs="12" sm="6">
                  <Label htmlFor="maxAmount">Max Amount</Label>
                  <Input type="number" name="maxAmount" placeholder="Max Amount" value={this.state.maxAmount} onChange={this.onChange} />
                </Col>

              </Row>

            </FormGroup>


            <FormGroup>
              <Row>

                <Col xs="12" sm="6">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input type="date" name="expiry" placeholder="Expiry" value={this.state.expiry} onChange={this.onChange} />
                </Col>

                <Col xs="12" sm="6">
                  <Label htmlFor="points">Points</Label>
                  <Input type="number" name="points" placeholder="Points" value={this.state.points} onChange={this.onChange} />
                </Col>

              </Row>

            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.create} disabled={this.state.processing}>
              {(this.state.processing)?"Creating...":"Create"}
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
    create: (token,params) => actions.createPromo(token,params),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreatePromo);
