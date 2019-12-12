import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';
import * as actionsCreators from "../../Store/Actions/MetaDataActions";
import * as actions from "../../Store/Actions/RoleAndPermissionActions";
import * as authActions from "../../Store/Actions/AuthActions";

import { connect } from "react-redux";
import alertify from "alertifyjs";
import {filterNavLinks} from "../../util/functions";

import {can} from '../../util/functions';

alertify.set('notifier','position', 'top-right');

class DefaultLayout extends Component {

  isAuthenticated = () => {
    return this.props.user !== null;
  };

  ability = (p,matchAll = false) => {
    let {permissions:prs} = this.props;
    return can(p,prs,matchAll);
  };

  componentDidMount(){

    let {fetchMetaData,dispatch,getAuthPermissions,user} = this.props;

    fetchMetaData().then(res => {
        dispatch({
          type:actionsCreators.GET_META_DATA,
          payload: res.data.data
        });
      }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });

    getAuthPermissions(user.accessToken,user.id).then(res => {
        dispatch({
          type:authActions.GET_AUTH_PERMISSIONS,
          payload: res.data
        });
      }).catch(({response}) => {
        alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
      });
  }

  render() {

    let {permissions} = this.props;

    if(permissions.length === 0){
      return <p/>;
    }

    let nav = filterNavLinks(navigation,permissions);

    return (

      <div className="app">
        <AppHeader fixed>
          <DefaultHeader history={this.props.history} />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={nav} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Switch>
                {routes.map((route, idx) => {
                    return route.component ? (
                      <Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => {
                        if(this.isAuthenticated()){
                          return <route.component alertify={alertify} ability={this.ability} {...props} {...this.props}/>
                        }
                        return <Redirect to='/login' />;
                      }}
                      />
                      )
                      : (null);
                  },
                )}
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </Container>
          </main>
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user:state.auth.user,
    permissions:state.auth.permissions,
    transactions: state.transactions.transactions,
    paymentMethods : state.metaData.paymentMethods,
    promoTypes : state.metaData.promoTypes,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
    fetchMetaData: actionsCreators.getMetaData,
    getAuthPermissions:(token,id) => actions.getUserPermissions(token,id)
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);
