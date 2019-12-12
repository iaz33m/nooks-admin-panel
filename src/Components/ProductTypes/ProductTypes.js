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
import * as actions from "../../Store/Actions/ProductTypeActions";

import {getSearchUrlFromState} from '../../util/functions';

import CreateProductType from "./CreateProductType";
import EditProductType from "./EditProductType";
import DeleteModal from "../Common/Modals/DeleteModal";

class ProductTypes extends Component {

  state = {
    name:"",
    page : 0,
    totalPages:0,
    isLoading:true
  };

  getProductTypes = (search) => {

    this.setState({
      isLoading: true
    });

    let {getProductTypes,dispatch,user,alertify} = this.props;

    getProductTypes(user.accessToken,search).then(res => {

      this.setState({
        page:res.data.meta.current_page,
        totalPages:res.data.meta.last_page,
      });

      dispatch({
        type: actions.GET_PRODUCT_TYPES,
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

    if(params.name){
      this.setState({
        name: params.name
      });
    }

    this.getProductTypes(search);
  }

  next = () => {
    let next = this.state.page + 1;
    if(next <= this.state.totalPages){
      let search = getSearchUrlFromState(this.state);
      this.getProductTypes(search+"page="+next);
    }
  };

  previous = () => {
    let previous = this.state.page - 1;
    if(previous > 0){
      let search = getSearchUrlFromState(this.state);
      this.getProductTypes(search+"page="+previous);
    }
  };

  renderEditCell = (isHead = true,productType = null) => {
    const {ability} = this.props;
    if(ability('productType-edit')) {
      return isHead ? <th>Edit</th>:<td><EditProductType {...this.props} productType={productType}/></td>;
    }
  };

  renderDeleteCell = (isHead = true,productType = null) => {
    const {ability} = this.props;
    if(ability('productType-delete')) {
      return isHead?<th>Delete</th>:<td><DeleteModal model={productType.name+" ProductType"} delete={()=>this.deleteProductType(productType.id)}/></td>;
    }
  };

  renderBody = () => {

    if(this.state.isLoading) {
      return ;
    }

    return this.props.productTypes.map(m => {

      return (<tr key={m.id}>
        <td>{m.id}</td>
        <td>{m.name}</td>
        <td>{m.order}</td>
        {this.renderEditCell(false,m)}
        {this.renderDeleteCell(false,m)}
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
    this.getProductTypes(search);
  };

  deleteProductType(id){

    let {user,deleteProductType,dispatch,alertify} = this.props;

    deleteProductType(user.accessToken,id).then(res => {
      dispatch({
        type: actions.DELETE_PRODUCT_TYPES,
        payload: id
      });
      alertify.success(res.data.message);
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });
  }

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
                    <i className="fa fa-align-justify" /> ProductTypes - Page {page} of {totalPages}
                  </Col>

                  <Col md="1.5">
                    <CreateProductType {...this.props}/>
                  </Col>

                  <Col md="5">
                    <InputGroup>

                      <Input type="text" placeholder="Name" name="name" onChange={this.onChange} value={this.state.name}/>

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
                    <th>Display Order</th>
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
    productTypes: state.productTypes.productTypes,
  };
};

const mapDispatchToProps = () => {
  return {
    getProductTypes: (token,search) => actions.getProductTypes(token,search),
    deleteProductType: (token,id) => actions.deleteProductType(token,id)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductTypes);
