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

import SimplePagination from "./Common/SimplePagination";
import * as actionsCreators from "../Store/Actions/GetTransactionsActions";
import {getSearchUrlFromState} from '../util/functions'

class Transactions extends Component {

  state = {
    payment_method:"",
    page : 0,
    totalPages:0,
    isLoading:true
  };

  getTransactions = (search) => {

    this.setState({
      isLoading: true
    });

    let {user,fetchData,dispatch,alertify} = this.props;

    fetchData(user.accessToken,search).then(res => {

        this.setState({
          page:res.data.meta.current_page,
          totalPages:res.data.meta.last_page,
        });

        dispatch({
          type: actionsCreators.GET_TRANSACTIONS,
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

    if(params.payment_method){
      this.setState({
        payment_method: params.payment_method
      });
    }

    this.getTransactions(search);
  }

  next = () => {
    let next = this.state.page + 1;
    if(next <= this.state.totalPages){
      let search = getSearchUrlFromState(this.state);
      this.getTransactions(search+"page="+next);
    }
  };

  previous = () => {
    let previous = this.state.page - 1;
    if(previous > 0){
      let search = getSearchUrlFromState(this.state);
      this.getTransactions(search+"page="+previous);
    }
  };

  renderBody = () => {

    if(this.state.isLoading) {
      return ;
    }

    return this.props.transactions.map(tr => {

      return (<tr key={tr.id}>
        <td>{tr.id}</td>
        <td>{tr.sub_total}</td>
        <td>{tr.discount}</td>
        <td>{tr.total}</td>
        <td>{tr.service_fee}</td>
        <td>{tr.payment_method}</td>
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
    this.getTransactions(search);
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
                    <i className="fa fa-align-justify" /> Transactions - Page {page} of {totalPages}
                  </Col>
                  <Col md="5">
                    <InputGroup>

                      <Input type="select" name="payment_method" onChange={this.onChange} value={this.state.payment_method}>
                        <option value="" key="all" >All</option>
                        {this.props.paymentMethods.map(p => <option key={p.key} value={p.key} >{p.value}</option>)}
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
                      <th>Sub Total</th>
                      <th>Discount</th>
                      <th>Total</th>
                      <th>Service Fee</th>
                      <th>Payment Method</th>
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

const mapDispatchToProps = () => {
  return {
    fetchData: (token,search) => actionsCreators.transactions(token,search)
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Transactions);
