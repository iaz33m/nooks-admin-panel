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
import * as actions from "../../Store/Actions/UserActions";

import * as roleActions from "../../Store/Actions/RoleAndPermissionActions";

import {can, getSearchUrlFromState} from '../../util/functions'

import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import BooleanBadge from "../Common/BooleanBadge";
import UserRolesBadge from "./UserRolesBadge";

class Users extends Component {

  state = {
    name:"",
    number:"",
    numberVerified:"",
    isActive:"",
    page : 0,
    totalPages:0,
    isLoading:true
  };

  userRolePrs = ['role-list','user-role-list','user-role-update'];


  getRoles = () => {

    const {ability} = this.props;

    if(ability(this.userRolePrs,true)){

      let {getRoles,dispatch,user,alertify} = this.props;

      getRoles(user.accessToken).then(res=>{

        dispatch({
          type: roleActions.GET_ROLES,
          payload: res.data.data
        });

      }).catch(({response}) => {
        alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
      });
    }

  };

  get = (search) => {

    this.setState({
      isLoading: true
    });

    let {get,dispatch,user,alertify} = this.props;

    this.getRoles();

    get(user.accessToken,search).then(res => {

      this.setState({
        page:res.data.meta.current_page,
        totalPages:res.data.meta.last_page,
      });

      dispatch({
        type: actions.GET_USERS,
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

  ability = (p,matchAll=false) => {
    let {permissions:prs} = this.props;
    return can(p,prs,matchAll);
  };

  renderRolesCell = (isHead = true,user = null) => {
    const {ability} = this.props;
    if(ability(this.userRolePrs,true)) {
      return isHead ? <th>Roles</th>:<td><UserRolesBadge {...this.props} u={user}/></td>
    }
  };

  renderEditCell = (isHead = true,user = null) => {
    const {ability} = this.props;
    if(ability('user-edit')) {
      return isHead ? <th>Edit</th>:<td><EditUser {...this.props} u={user}/></td>;
    }
  };

  renderBody = () => {

    if(this.state.isLoading) {
      return ;
    }

    return this.props.users.map(m => {

      return (<tr key={m.id}>
        <td>{m.id}</td>
        <td>{m.name}</td>
        <td>{m.number}</td>
        {this.renderRolesCell(false,m)}
        <td><BooleanBadge boolean={m.numberVerified}/></td>
        <td><BooleanBadge boolean={m.isActive}/></td>
        {this.renderEditCell(false,m)}
      </tr>);
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

  render() {

    let {page,totalPages} = this.state;

    return (

      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="2">
                    <i className="fa fa-align-justify" /> Users - Page {page} of {totalPages}
                  </Col>

                  <Col md="1.5">
                    <CreateUser {...this.props} label={"Create User"}/>
                  </Col>

                  <Col md="6">
                    <InputGroup>

                      <Input type="number" placeholder="Number" name="number" onChange={this.onChange} value={this.state.number}/>
                      <Input type="text" placeholder="Name" name="name" onChange={this.onChange} value={this.state.name}/>

                      <Input type="select" name="isActive" onChange={this.onChange} value={this.state.isActive}>
                        <option value="" key="all" >All</option>
                        <option value="1" key="1" >Active</option>
                        <option value="0" key="0" >Not Active</option>
                      </Input>

                      <Input type="select" name="numberVerified" onChange={this.onChange} value={this.state.numberVerified}>
                        <option value="" key="all" >All</option>
                        <option value="1" key="1" >Number Verified</option>
                        <option value="0" key="0" >Not Verified</option>
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
                    <th>Name</th>
                    <th>Number</th>
                    {this.renderRolesCell()}
                    <th>Number Verified</th>
                    <th>Active</th>
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
    users: state.users.users,
    roles:state.roleAndPermissions.roles,
  };
};

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getUsers(token,search),
    getRoles: (token) => roleActions.getRoles(token),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
