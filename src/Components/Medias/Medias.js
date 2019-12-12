import React, {Component} from "react";
import {
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import MediaList from "./MediaList";
import CreateMedia from "./CreateMedia";

class Medias extends Component {

  state = {
    activeTab:0,
  };

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  renderCreateMediaTab = (tab = true) => {
    const {ability} = this.props;
    const {activeTab} = this.state;
    if(ability('media-create')){
      if(tab){
        return <ListGroupItem onClick={() => this.toggle(1)} action active={activeTab === 1} >Create Media</ListGroupItem>;
      }else{
        return <TabPane key={1} tabId={1}><CreateMedia {...this.props}/></TabPane>;
      }
    }
  };

  renderListMediaTab = (tab = true) => {
    const {ability} = this.props;
    const {activeTab} = this.state;
    if(ability('media-list')){
      if(tab){
        return <ListGroupItem onClick={() => this.toggle(0)} action active={activeTab === 0} >Media List</ListGroupItem>;
      }else{
        return <TabPane key={0} tabId={0}><MediaList {...this.props}/></TabPane>
      }
    }
  };

  render(){

    const {activeTab} = this.state;

    return (
      <Row>
        <Col xs="3">
          <ListGroup id="list-tab" role="tablist">
            {this.renderListMediaTab()}
            {this.renderCreateMediaTab()}
          </ListGroup>
        </Col>
        <Col xs="9">
          <TabContent activeTab={activeTab}>
            {this.renderListMediaTab(false)}
            {this.renderCreateMediaTab(false)}
          </TabContent>
        </Col>
      </Row>
    );
  }
}

export default Medias;
