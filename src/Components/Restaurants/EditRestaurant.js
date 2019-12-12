import React, {Component} from "react";

import {
  Button,
  Row,Col,Label,FormGroup,
  Card,
  CardBody,
  CardHeader,
  Nav,NavLink,NavItem,
  TabContent,TabPane
} from 'reactstrap';

import {connect} from "react-redux";
import * as qs from "query-string";
import classnames from "classnames";

import UserSelect from "../Users/UserSelect";
import TagSelect from "../Tags/TagSelect";
import RestaurantForm from "./RestaurantForm";
import * as actions from "../../Store/Actions/RestaurantsActions";

import MediasModal from "../Medias/MediasModal";
import TimeSlots from "../TimeSlots/TimeSlots";
import LocationSelector from "../MapAndLocation/LocationSelector";
import Categories from "../Categories/Categories";

class EditRestaurant extends Component {

  state = {
    activeTab : 0,
    processing:false,
    loading:true,
    changesSaved:true
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      changesSaved:false
    });
  };

  componentWillMount(){
    let search = this.props.location.search;
    const params = qs.parse(search);
    this.getDetails(params.id);
  };

  getDetails = (id)=>{
    let {user,show,dispatch,alertify} = this.props;
    show(user.accessToken,id).then(res => {
      let rest = res.data.data;
      dispatch({
        type: actions.EDIT_RESTAURANT,
        payload: rest
      });

      this.setState({
        ...rest,
        isVeg:(rest.isVeg)?'1':'0',
        isApproved:(rest.isApproved)?'1':'0',
      });

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        loading: false
      });
    });
  };

  edit = () => {

    this.setState({
      processing:true
    });

    let {managers,tags,id} = this.state;
    let {user,edit,dispatch,alertify} = this.props;

    let params = {
      ...this.state,
      managers: managers.map(m=>m.id),
      tags: tags.map(t=>t.id)
    };

    console.log('params',params);

    edit(user.accessToken,id,params).then(res => {
      dispatch({
        type: actions.EDIT_RESTAURANT,
        payload: {...this.state}
      });
      alertify.success(res.data.message);
      this.setState({changesSaved:true});

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        processing:false
      });
    });
  };

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  renderUpdateOrderCard = (processing,savedChanges) => {
    const {ability} = this.props;
    if(ability('restaurant-edit')){
      return (
        <Card>
          <CardHeader>
            <strong>Save Changes</strong>
          </CardHeader>
          <CardBody>
            <Button disabled={processing} onClick={this.edit} type="submit" color={(savedChanges)?"success":"danger"}><i className="fa fa-spinner"/>
              {(processing)?" Saving...":(savedChanges)?" Saved":" Save Changes"}
            </Button>
          </CardBody>
        </Card>
      );
    }
  };

  renderUpdateMediaButton = (media_id,changesSaved,icon,id) => {
    const {ability} = this.props;
    if(ability(['restaurant-edit','media-list'],true)){
      return (
        <FormGroup>
          <Row>
            <Col xs="12" sm="2">
              <MediasModal
                style={{
                  display:'block'
                }}
                {...this.props}
                media_id={media_id}
                rest_id={id}
                onChange={m => this.setState({media_id:m.id,icon:m.path,changesSaved})}
                media={{id:media_id,path:icon}}
              />
            </Col>
          </Row>
        </FormGroup>
      );
    }
  };


  renderCategoryTab(id,activeTab,tab = true){
    const {ability} = this.props;
    if(ability('category-list')){
      if(tab){
        return (
          <NavItem>
            <NavLink className={classnames({ active: activeTab === 1 })} onClick={() => { this.toggleTab(1); }}>Menu</NavLink>
          </NavItem>
        );
      }else{
        return (
          <TabPane tabId={1}>
            <Categories {...this.props} rest_id={id} />
          </TabPane>
        );
      }
    }
  }

  render(){

    const {loading} = this.state;

    if(loading){
      return <p>Loading...</p>
    }

    const {id,icon,name,processing,activeTab,lat,lng,timeSlots,tags,managers,media_id,changesSaved:savedChanges} = this.state;

    let changesSaved = false;

    return (
      <Row>
        <Col xs="12" sm="12">
          <div className="animated fadeIn">
            <Row>
              <Col xs="12" sm="9">
                <Card>
                  <CardHeader>
                    <strong>{name}</strong>
                  </CardHeader>
                  <CardBody>

                    <Nav tabs>
                      <NavItem>
                        <NavLink className={classnames({ active: activeTab === 0 })} onClick={() => { this.toggleTab(0); }}>Home</NavLink>
                      </NavItem>
                      {this.renderCategoryTab(null,activeTab)}
                      <NavItem>
                        <NavLink className={classnames({ active: activeTab === 2 })} onClick={() => { this.toggleTab(2); }}>Time Slots</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink className={classnames({ active: activeTab === 3 })} onClick={() => { this.toggleTab(3); }}>Location</NavLink>
                      </NavItem>
                    </Nav>


                    <TabContent activeTab={this.state.activeTab}>
                      <TabPane tabId={0}>
                        <RestaurantForm {...this.props} {...this.state} onChange={this.onChange} forEdit/>
                        <FormGroup>
                          <Row>
                            <Col xs="12" sm="6">
                              <Label htmlFor="selectManagers">Managers</Label>
                              <UserSelect name="selectManagers" {...this.props} onChange={managers => this.setState({managers,changesSaved})} placeholder="Select Managers" users={managers}/>

                            </Col>

                            <Col xs="12" sm="6">
                              <Label htmlFor="selectTags">Tags</Label>
                              <TagSelect name="selectTags" {...this.props} onChange={tags => this.setState({tags,changesSaved})}  placeholder="Select Tags" tags={tags}/>
                            </Col>
                          </Row>
                        </FormGroup>
                      </TabPane>

                      {this.renderCategoryTab(id,null,false)}

                      <TabPane tabId={2}>
                        <TimeSlots {...this.props} onChange={timeSlots => this.setState({timeSlots,changesSaved})} daySlots={timeSlots} forEdit/>
                      </TabPane>

                      <TabPane tabId={3} style={{height: '550px'}}>
                        <LocationSelector style={{width:'85%',height:'75%'}} location={{lat,lng}} onLocationChange={l => this.setState({...l,changesSaved})}/>
                      </TabPane>

                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="12" sm="3">
                {this.renderUpdateOrderCard(processing,savedChanges)}
                <Card>
                  <CardHeader>
                    <strong>Media</strong>
                  </CardHeader>
                  <CardBody>
                    <FormGroup>
                      <Row className="text-center">
                        <Col xs="12" sm="12">
                          <img className="img img-responsive img-thumbnail" src={icon}/>
                        </Col>
                      </Row>
                    </FormGroup>

                    {this.renderUpdateMediaButton(media_id,changesSaved,icon,id)}

                  </CardBody>
                </Card>

              </Col>
            </Row>
          </div>
        </Col>
      </Row>

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
    show: (token,id) => actions.showRestaurant(token,id),
    edit: (token,id,params) => actions.editRestaurant(token,id,params),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditRestaurant);
