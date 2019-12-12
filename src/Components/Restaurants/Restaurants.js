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
import * as actions from "../../Store/Actions/RestaurantsActions";

import {can, getSearchUrlFromState} from '../../util/functions'
import BooleanBadge from "../Common/BooleanBadge";
import CreateRestaurant from "./CreateRestaurant";
import {Link} from "react-router-dom";
import CreateUser from "../Users/CreateUser";


class Restaurants extends Component {

  state = {
    isVeg:"",
    status:"",
    search:"",
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
        type: actions.GET_RESTAURANTS,
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

  renderEditCell = (isHead = true,m = null) => {
    let {ability} = this.props;
    if(ability(['restaurant-edit','restaurant-show'],true)) {
      return isHead ? <th>Edit</th>:<td><Button color="primary" tag={Link} to={`/restaurants/edit?id=${m.id}`} ><i className="fa fa-pencil"/> Edit</Button></td>;
    }
  };


  renderBody = () => {

    if(this.state.isLoading) {
      return ;
    }

    return this.props.restaurants.map(m => {

      return (
        <tr key={m.id}>
          <td>{m.id}</td>
          <td><img width="200px" className="img img-responsive" src={m.icon}/></td>
          <td>{m.name}</td>
          <td>{(m.description)?m.description.substring(0, 100):""}...</td>
          <td><BooleanBadge boolean={m.isApproved}/></td>
          <td><BooleanBadge boolean={m.isVeg}/></td>
          <td>{m.rating} ({m.reviews_count})</td>
          {this.renderEditCell(false,m)}
        </tr>
      );

    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };


  filter = () => {
    let search = getSearchUrlFromState(this.state);
    this.get(search);
  };

  renderCreateRestBtn = () => {
    const {ability} = this.props;
    if(ability('restaurant-create')){
      return (
        <Col md="1.5">
          <CreateRestaurant {...this.props}/>
        </Col>
      );
    }
  };

  render() {

    let {page,totalPages} = this.state;
    let {statuses} = this.props;

    return (

      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="2">
                    <i className="fa fa-align-justify" /> Restaurants - Page {page} of {totalPages}
                  </Col>

                  {this.renderCreateRestBtn()}

                  <Col md="1.5">
                    <CreateUser {...this.props} label={"Create Manager"}/>
                  </Col>

                  <Col md="6">
                    <InputGroup>

                      <Input type="text" placeholder="Name" name="search" onChange={this.onChange} value={this.state.search}/>

                      <Input type="select" name="isVeg" onChange={this.onChange} value={this.state.isVeg}>
                        <option value="" key="all" >All</option>
                        <option value="1" key="1" >Veg Only</option>
                        <option value="0" key="0" >Not Veg</option>
                      </Input>

                      <Input type="select" name="status" onChange={this.onChange} value={this.state.status}>
                        <option value="" key="all" >All</option>
                        {statuses.map(p => <option key={p.key} value={p.key} >{p.value}</option>)}
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
                    <th>Details</th>
                    <th>Approved</th>
                    <th>Veg only</th>
                    <th>Rating</th>
                   {this.renderEditCell()}
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
    restaurants: state.restaurants.restaurants,
    statuses:state.metaData.restaurantsStatuses
  };
};

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getRestaurants(token,search),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurants);
