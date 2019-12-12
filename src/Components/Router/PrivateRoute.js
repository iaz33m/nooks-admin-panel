import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class PrivateRoute extends Component {

  isAuthenticated = () => {
    return this.props.user !== null;
  };

  renderComponentOrRedirect = (props,C) => {
    if(this.isAuthenticated()){
      return <C {...props} />
    }
    return <Redirect to='/login' />;
  };


  render(){
    let { component: c, ...rest } = this.props;
    return <Route {...rest} render={props=>this.renderComponentOrRedirect(props,c)} />;
  }
}

const mapStateToProps = state => {
  return {
    user:state.auth.user,
    transactions: state.transactions.transactions,
    paymentMethods : state.metaData.paymentMethods,
  };
};

export default connect(
  mapStateToProps,
  null
)(PrivateRoute);
