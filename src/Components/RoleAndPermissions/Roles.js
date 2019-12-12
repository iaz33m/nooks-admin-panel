import React, {Component} from "react";
import {connect} from "react-redux";

import {Col, Row,} from 'reactstrap';
import RolesList from './RolesList';
import * as actions from "../../Store/Actions/RoleAndPermissionActions";

class Roles extends Component {

  componentDidMount(){
    this.getPermissions();
  }

  getPermissions = () => {

    let {getPermissions,user,dispatch,alertify} = this.props;

    getPermissions(user.accessToken).then(res => {
        dispatch({
          type: actions.GET_PERMISSIONS,
          payload: res.data.data
        });
      }).catch(({response}) => {
        alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
      });
  };

  render(){
    return (
      <div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="12">
          <RolesList {...this.props}/>
        </Col>
      </Row>
    </div>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    getPermissions: token => actions.getPermissions(token)
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Roles);
