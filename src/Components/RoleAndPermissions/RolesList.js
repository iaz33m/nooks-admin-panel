import React, {Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../Store/Actions/RoleAndPermissionActions";

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
} from 'reactstrap';

import AddPermission from "./AddPermission";
import AddRole from "./AddRole";
import RoleTableCell from "./RoleTableCell";

import {can} from "../../util/functions";

class RolesList extends Component {

  componentDidMount(){
    this.getRoles();
  }

  getRoles = () => {

    let {user,getRoles,dispatch,alertify} = this.props;

    getRoles(user.accessToken).then(res => {

        dispatch({
          type: actions.GET_ROLES,
          payload: res.data.data
        });

      }).catch(({response}) => {
        alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
      });
  };

  renderEditButtonCell = () => {
    let {permissions:prs} = this.props;
    if(can('role-permission-update',prs)){
      return <th>Edit</th>;
    }
  };

  render(){

    return (<Card>
      <CardHeader>

        <Row>
          <Col md="1">
            <i className="fa fa-align-justify" /> Roles
          </Col>
          <Col md="8">
            <AddRole {...this.props}/>
            <AddPermission {...this.props}/>
          </Col>
        </Row>

      </CardHeader>
      <CardBody>
        <Table responsive bordered striped>
          <thead>
          <tr>
            <th>Role</th>
            <th>Permissions</th>
            {this.renderEditButtonCell()}
          </tr>
          </thead>
          <tbody>{this.props.roles.map(r => <RoleTableCell key={r.id} r={r} {...this.props}/>)}</tbody>

        </Table>

      </CardBody>
    </Card>);
  }
}

const mapStateToProps = state => {
  return {
    roles:state.roleAndPermissions.roles,
  };
};

const mapDispatchToProps = () => {
  return {
    getRoles: token => actions.getRoles(token),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RolesList);
