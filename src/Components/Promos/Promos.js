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
  Table,
} from "reactstrap";

import SimplePagination from "../Common/SimplePagination";
import * as actions from "../../Store/Actions/PromoActions";

import {getSearchUrlFromState} from '../../util/functions'

import CreatePromo from "./CreatePromo";
import EditPromo from "./EditPromo";
import DeleteModal from "../Common/Modals/DeleteModal";
import RestaurantSelect from "../Restaurants/RestaurantSelect";

class Promos extends Component {

  state = {
    rest_id:"",
    type:"",
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
        type: actions.GET_PROMOS,
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

  componentDidMount() {

    let search = this.props.location.search;

    const params = qs.parse(search);

    if(params.type){
      this.setState({
        type: params.type
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

  renderEditCell = (isHead = true,m = null) => {
    const {ability} = this.props;
    if(ability('promo-edit')) {
      return isHead ? <th>Edit</th>:<td><EditPromo {...this.props} promo={m}/></td>;
    }
  };

  renderDeleteCell = (isHead = true,m = null) => {
    const {ability} = this.props;
    if(ability('promo-delete')) {
      return isHead?<th>Delete</th>:<td><DeleteModal model="Promo" delete={()=>this.deleteModel(m.id)}/></td>;
    }
  };

  renderBody = () => {

    if(this.state.isLoading) {
      return ;
    }

    return this.props.promos.map(m => {

      return (
        <tr key={m.id}>
          <td>{m.id}</td>
          <td>{m.title}</td>
          <td>{m.details.substring(1, 120)}...</td>
          <td>{m.type}</td>
          <td>{m.restName}</td>
          <td>{m.expiry}</td>
          {this.renderEditCell(false,m)}
          {this.renderDeleteCell(false,m)}
        </tr>
      );
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onRestaurantChange = rest_id => {
    this.setState({
      rest_id
    });
  };


  filter = () => {
    let search = getSearchUrlFromState(this.state);
    this.get(search);
  };

  deleteModel(id){

    let {user,deleteModel,dispatch,alertify} = this.props;

    deleteModel(user.accessToken,id).then(res => {
      dispatch({
        type: actions.DELETE_PROMO,
        payload: id
      });
      alertify.success(res.data.message);
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });
  }

  render() {

    let {page,totalPages} = this.state;
    let {promoTypes} = this.props;

    return (

      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="2">
                    <i className="fa fa-align-justify" /> Promos - Page {page} of {totalPages}
                  </Col>

                  <Col md="1.5">
                    <CreatePromo {...this.props}/>
                  </Col>

                  <Col md="2">
                    <RestaurantSelect withAllOption {...this.props} onChange={this.onRestaurantChange}/>
                  </Col>

                  <Col md="4">
                    <InputGroup>

                      <Input type="select" name="type" onChange={this.onChange} value={this.state.type}>
                        <option value="" key="all" >All</option>
                        {promoTypes.map(p => <option key={p.key} value={p.key} >{p.value}</option>)}
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
                    <th>Title</th>
                    <th>Details</th>
                    <th>Type</th>
                    <th>Restaurant Name</th>
                    <th>Expiry</th>
                    {this.renderEditCell()}
                    {this.renderDeleteCell()}
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
    promos: state.promos.promos,
  };
};

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getPromos(token,search),
    deleteModel: (token,id) => actions.deletePromo(token,id)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Promos);
