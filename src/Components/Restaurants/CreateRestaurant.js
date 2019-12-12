import React, {Component} from "react";

import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,
  Nav, NavItem, NavLink, TabContent, TabPane,
  Row,Col,Label,FormGroup
} from 'reactstrap';

import LocationSelector from "../MapAndLocation/LocationSelector";
import UserSelect from "../Users/UserSelect";
import TagSelect from "../Tags/TagSelect";
import TimeSlots from "../TimeSlots/TimeSlots";
import classnames from "classnames";
import RestaurantForm from "./RestaurantForm";
import * as actions from "../../Store/Actions/RestaurantsActions";

import {connect} from "react-redux";

const style = {
  height: '550px'
};

class CreateRestaurant extends Component {

  state = {
    isOpen:false,
    activeTab : 0,
    name:'',
    description:'',
    isVeg:'0',
    delivery_time:'',
    min_delivery:'',
    delivery_fee:'',
    free_delivery_price:'',
    address:'',
    about:'',
    lat:"",
    lng:"",
    media_id:0,
    managers:[],
    tags:[],
    processing:false
  };

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  create = () => {

    this.setState({
      processing:true
    });
    let {managers,tags} = this.state;
    let {user,create,dispatch,alertify} = this.props;

    let params = {
      ...this.state,
      managers: managers.map(m=>m.id),
      tags: tags.map(t=>t.id)
    };

    create(user.accessToken,params).then(res => {
      dispatch({
        type: actions.CREATE_RESTAURANT,
        payload: res.data.data
      });
      alertify.success(res.data.message);
      this.setState({
        isOpen:false
      });
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        processing:false
      });
    });
  };

  render(){

    let {activeTab,processing} = this.state;

    return (
      <React.Fragment>
        <Button color="success" onClick={this.toggle} className="mr-1">
          <i className="fa fa-plus"/> Create
        </Button>
        <Modal  style={{}} isOpen={this.state.isOpen} toggle={this.toggle} className="modal-success modal-lg">
          <ModalHeader style={{}} toggle={this.toggle}> Create</ModalHeader>
          <ModalBody style={style}>
            <Nav tabs>
              <NavItem>
                <NavLink className={classnames({ active: activeTab === 0 })} onClick={() => { this.toggleTab(0); }}>Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={classnames({ active: activeTab === 1 })} onClick={() => { this.toggleTab(1); }}>Tags & Managers</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={classnames({ active: activeTab === 2 })} onClick={() => { this.toggleTab(2); }}>Time Slots</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={classnames({ active: activeTab === 3 })} onClick={() => { this.toggleTab(3); }}>Location</NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId={0}>
                <RestaurantForm {...this.props} {...this.state} onChange={this.onChange}/>
              </TabPane>
              <TabPane tabId={1}>
                <FormGroup>
                  <Row>
                    <Col xs="12" sm="6">
                      <Label htmlFor="selectManagers">Managers</Label>
                      <UserSelect name="selectManagers" {...this.props} onChange={managers => this.setState({managers})} placeholder="Select Managers"/>
                    </Col>

                    <Col xs="12" sm="6">
                      <Label htmlFor="selectTags">Tags</Label>
                      <TagSelect name="selectTags" {...this.props} onChange={tags => this.setState({tags})}  placeholder="Select Tags"/>
                    </Col>
                  </Row>
                </FormGroup>
              </TabPane>
              <TabPane tabId={2}>
                <TimeSlots {...this.props} onChange={timeSlots => this.setState({timeSlots})}/>
              </TabPane>
              <TabPane tabId={3} style={{height: '480px'}}>
                <LocationSelector style={{
                  width: '730px',
                  height: '450px'
                }} centerAroundCurrentLocation onLocationChange={l => this.setState({...l})}/>
              </TabPane>
            </TabContent>

          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.create} disabled={processing} >
              {(processing)?"Creating...":"Create"}
            </Button>
            <Button onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    create: (token,params) => actions.createRestaurant(token,params)
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateRestaurant);
