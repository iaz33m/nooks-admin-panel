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

import * as actions from "../../Store/Actions/CategoryActions";
import {connect} from "react-redux";
import CreateCategory from "./CreateCategory";
import DeleteModal from "../Common/Modals/DeleteModal";
import EditCategory from "./EditCategory";
import Products from "../Products/Products";

class Categories extends Component {

  state = {
    search:"",
    activeTab:0,
    rest_id:this.props.rest_id,
  };

  componentWillMount(){
    let {rest_id} = this.props;
    this.get(rest_id);
  }

  search = () => {
    const {search} = this.state;
    let {rest_id} = this.props;
    this.get(rest_id,`?name=${search}&`);
  };

  get = (rest_id,search = '?') => {

    let {get,dispatch,user,alertify} = this.props;

    search+=`rest_id=${rest_id}`;

    get(user.accessToken,search).then(res => {

      dispatch({
        type: actions.GET_CATEGORIES,
        payload: {
          categories: res.data.data,
          rest_id : rest_id
        }
      });

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });

  };

  deleteModel(cat_id){

    let {user,deleteModel,dispatch,alertify,rest_id} = this.props;

    deleteModel(user.accessToken,cat_id).then(res => {
      dispatch({
        type: actions.DELETE_CATEGORY,
        payload: {cat_id,rest_id}
      });
      alertify.success(res.data.message);
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });
  }

  toggle(activeTab) {
    if (this.state.activeTab !== activeTab) {
      this.setState({activeTab});
    }
  }

  getCategories = () => {
    const {categories,rest_id} = this.props;
    return (categories[rest_id])?categories[rest_id]:[];
  };

  onInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  renderDealBadge = c => {
    if(c.isDeal){
      return <Badge color="warning">Deal</Badge>
    }
  };

  renderCreateCategoryBtn = (rest_id) => {
    const {ability} = this.props;
    if(ability('category-create')){
      return <CreateCategory {...this.props} rest_id={rest_id}/>;
    }
  };

  renderEditCategoryBtn = (rest_id,c) => {
    const {ability} = this.props;
    if(ability('category-edit')){
      return <EditCategory {...this.props} rest_id={rest_id} category={c} />;
    }
  };

  renderDeleteCategoryBtn = (c) => {
    const {ability} = this.props;
    if(ability('category-delete')){
      return <DeleteModal color="link" className="text-danger" model="Menu" delete={() => this.deleteModel(c.id)} ><i className="fa fa-trash"/></DeleteModal>;
    }
  };

  renderProducts = (rest_id,c) => {
    const {ability} = this.props;
    if(ability('product-list')){
      return (
        <React.Fragment>
          <FormGroup>
            <h5>Products</h5>
          </FormGroup>

          <Products {...this.props} cat_id={c.id} rest_id={rest_id}/>
        </React.Fragment>
      );
    }
  };

  render(){

    const cats = this.getCategories();
    const {activeTab,search,rest_id} = this.state;

    return (

      <React.Fragment>
        <FormGroup>
          <Row>
            <Col xs="6" sm="10">
              <Input type="text" name="search" placeholder="Search" value={search} onChange={this.onInputChange} />
            </Col>
            <Col xs="6" sm="2">
              <Button block color="success" onClick={this.search}><i className="fa fa-search"/> Search</Button>
            </Col>
          </Row>
        </FormGroup>

        <Row>
          <Col xs="3">
            <ListGroup id="list-tab" role="tablist">
              {cats.map((c,i) => (
                <ListGroupItem key={i} onClick={() => this.toggle(i)} action active={activeTab === i} >
                  <h6>{c.name} {this.renderDealBadge(c)}</h6>
                </ListGroupItem>
              ))}
            </ListGroup>

            <FormGroup/>

            {this.renderCreateCategoryBtn(rest_id)}

          </Col>
          <Col xs="9">
            <TabContent activeTab={activeTab}>
              {cats.map((c,i) => (
                <TabPane key={i} tabId={i}  >

                  <Row>
                    <Col xs={{ size: 6, offset: 6 }} style={{textAlign:"right"}}>
                      {this.renderEditCategoryBtn(rest_id,c)}
                      {this.renderDeleteCategoryBtn(c)}
                    </Col>
                  </Row>

                  <FormGroup>
                    {c.description}
                  </FormGroup>

                  {this.renderProducts(rest_id,c)}

                </TabPane>
              ))}
            </TabContent>
          </Col>
        </Row>

      </React.Fragment>


    );
  }
}



const mapStateToProps = state => {
  return {
    categories: state.categories.categories,
  };
};

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getCategories(token,search),
    deleteModel: (token,id) => actions.deleteCategory(token,id),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);
