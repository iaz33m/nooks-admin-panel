import React, { Component } from "react";
import { connect } from "react-redux";
import * as qs from 'query-string';
import {
  Card,
  CardBody,
  CardHeader,
  Col, Input, InputGroup, InputGroupAddon,
  Button,
  Row,
  Table,Badge,
} from "reactstrap";

import SimplePagination from "../Common/SimplePagination";
import * as actions from "../../Store/Actions/OrderActions";

import {getSearchUrlFromState} from '../../util/functions'
import BooleanBadge from "../Common/BooleanBadge";
import RestaurantSelect from "../Restaurants/RestaurantSelect";
import EditOrderPickupTime from "./EditOrderPickupTime";
import ShowOrder from "./ShowOrder";

class Orders extends Component {

  state = {
    status:"",delivery_type:"",name:"",number:"",user_id:"",rest_id:"",
    page : 0,
    totalPages:0,
    isLoading:true
  };

  get = (search) => {

    this.setState({
      isLoading: true
    });

    let {get,dispatch,user,alertify} = this.props;

    get(user.accessToken,search).then(res => {

      this.setState({
        page:res.data.meta.current_page,
        totalPages:res.data.meta.last_page,
      });

      dispatch({
        type: actions.GET_ORDERS,
        payload: res.data.data
      });

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        isLoading: false
      });
    });
  };

  approveOrder = id =>{
    this.edit(id,{
      status:"accepted"
    });
  };

  edit = (id,params) => {
    let {user,edit,dispatch,alertify} = this.props;
    edit(user.accessToken,id,params).then(res => {
      console.log("rest: ",res.data.data);
      dispatch({
        type: actions.EDIT_ORDER,
        payload: res.data.data
      });
      alertify.success(res.data.message);
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });
  };

  componentDidMount() {

    let search = this.props.location.search;

    const params = qs.parse(search);

    for(let key in params) {
      this.setState({
        [key]: params[key]
      });
    }

    this.get(search);
  }

  next = () => {
    let next = this.state.page + 1;
    if(next <= this.state.totalPages){
      let search = getSearchUrlFromState(this.state);
      this.get(search+"page="+next);
    }
  };

  previous = () => {
    let previous = this.state.page - 1;
    if(previous > 0){
      let search = getSearchUrlFromState(this.state);
      this.get(search+"page="+previous);
    }
  };

  renderShowCell = (isHead = true,model = null) => {
    const {ability} = this.props;
    if(ability('order-show')) {
      return isHead ? <th>Details</th>:<td><ShowOrder {...this.props} id={model.id}/></td>;
    }
  };

  renderDeliveryStatus = (m) => {
    if(!m.isDelivered){
      return <td><BooleanBadge boolean={m.isDelivered}/></td>
    }
    return <td><Badge style={{padding:"5px",fontSize:"12px"}} color="success">Delivered at {m.delivered_at}</Badge></td>
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };


  approveStatusBtn = (m)=>{
    const {ability} = this.props;
    if(ability('order-edit')) {
      if(m.status_key === "pending"){
        return <Button color="link" onClick={()=>this.approveOrder(m.id)}>Approve</Button>
      }
    }
  };

  renderEditPickupTimeBtn = m => {
    const {ability} = this.props;
    if(ability('order-edit')) {
      if(m.status_key !== 'on_way' && m.status_key !== 'delivered' ){
        return <EditOrderPickupTime edit={this.edit} id={m.id} pickup={m.pickup}/>
      }
    }
  };

  renderBody = () => {

    if(this.state.isLoading) {
      return ;
    }

    return this.props.orders.map(m => {
      return (<tr key={m.id}>
        <td>{m.id}</td>
        <td><img width="150px" className="img img-responsive" src={m.icon}/></td>
        <td>{m.name}</td>
        <td>{m.restaurant}</td>
        <td><Badge style={{color:"white",backgroundColor:`#${m.statusColor}`}}>{m.status}</Badge>{this.approveStatusBtn(m)}</td>
        <td>{m.total}</td>
        <td>{m.delivery_type}</td>
        <td>{m.prep_time} Min</td>
        <td>{m.pickup_time} {this.renderEditPickupTimeBtn(m)}</td>
        <td>{m.delivery_time}</td>
        {this.renderDeliveryStatus(m)}
        {this.renderShowCell(false,m)}
      </tr>);
    });
  };

  filter = () => {
    let search = getSearchUrlFromState(this.state);
    this.get(search);
  };

  render() {

    let {page,totalPages,name,number,status,delivery_type} = this.state;
    let {deliveryTypes,statuses} = this.props;

    return (

      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="2">
                    <i className="fa fa-align-justify" /> Orders - Page {page} of {totalPages}
                  </Col>

                  <Col md="2">
                    <RestaurantSelect withAllOption {...this.props} onChange={rest_id => this.setState({rest_id})}/>
                  </Col>

                  <Col md="6">
                    <InputGroup>

                      <Input type="text" placeholder="Name" name="name" onChange={this.onChange} value={name}/>
                      <Input type="number" placeholder="Number" name="number" onChange={this.onChange} value={number}/>

                      <Input type="select" name="status" onChange={this.onChange} value={status}>
                        <option value="" key="all" >All</option>
                        {statuses.map(p => <option key={p.key} value={p.key} >{p.value}</option>)}
                      </Input>

                      <Input type="select" name="delivery_type" onChange={this.onChange} value={delivery_type}>
                        <option value="" key="all" >All</option>
                        {deliveryTypes.map(p => <option key={p.key} value={p.key} >{p.value}</option>)}
                      </Input>

                      <InputGroupAddon addonType="append">
                        <Button type="button" color="warning" onClick={this.filter}><i className="fa fa-filter"/> Filter</Button>
                      </InputGroupAddon>

                    </InputGroup>
                  </Col>
                </Row>

              </CardHeader>
              <CardBody>
                <Table responsive bordered striped>
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Restaurant</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Delivery Type</th>
                    <th>Prep Time</th>
                    <th>Pickup Time</th>
                    <th>Delivery Time</th>
                    <th>Delivery Status</th>
                    {this.renderShowCell()}
                  </tr>
                  </thead>
                  <tbody>
                  {this.renderBody()}
                  </tbody>
                </Table>

                <SimplePagination next={this.next} previous={this.previous}/>

              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orders: state.orders.orders,
    statuses: state.metaData.orderStatuses,
    deliveryTypes: state.metaData.deliveryTypes,
  };
};

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getOrders(token,search),
    edit: (token,id,params) => actions.editOrder(token,id,params)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
