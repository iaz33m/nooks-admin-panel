import React, {Component} from "react";
import {
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  TabContent,
  TabPane,
  Input,Button,FormGroup,Badge
} from 'reactstrap';

import * as actions from "../../Store/Actions/ProductActions";
import {connect} from "react-redux";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";


class Products extends Component {

  state = {
    search:"",
    activeTab:0,
    cat_id:this.props.cat_id,
    rest_id:this.props.rest_id,
  };

  componentWillMount(){
    let {cat_id} = this.props;
    this.get(cat_id);
  }

  search = () => {
    const {search} = this.state;
    let {cat_id} = this.props;
    this.get(cat_id,`?name=${search}&`);
  };

  get = (cat_id,search = '?') => {

    let {get,dispatch,user,alertify} = this.props;

    search+=`cat_id=${cat_id}`;

    get(user.accessToken,search).then(res => {

      dispatch({
        type: actions.GET_PRODUCTS,
        payload: {
          products: res.data.data,
          cat_id
        }
      });

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });

  };

  getProducts = () => {
    const {products,cat_id} = this.props;
    return (products[cat_id])?products[cat_id]:[];
  };


  renderCreateProductBtn = (rest_id,cat_id)=>{
    const {ability} = this.props;
    if(ability('product-create')){
      return (
        <FormGroup>
          <CreateProduct {...this.props} rest_id={rest_id} cat_id={cat_id}/>
        </FormGroup>
      );
    }
  };

  render(){

    const products = this.getProducts();
    const {cat_id,rest_id} = this.state;

    return (

      <React.Fragment>
        <FormGroup>
          <ListGroup id="list-tab" role="tablist">
            {products.map((p,i) => (
              <EditProduct  key={i} {...this.props} rest_id={rest_id} cat_id={cat_id} product={p} />
            ))}
          </ListGroup>
        </FormGroup>

        {this.renderCreateProductBtn(rest_id,cat_id)}

      </React.Fragment>


    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products.products,
  };
};

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getProducts(token,search),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Products);
