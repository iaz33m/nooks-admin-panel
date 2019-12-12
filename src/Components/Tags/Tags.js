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
import * as actions from "../../Store/Actions/TagActions";

import {getSearchUrlFromState} from '../../util/functions'

import CreateTag from "./CreateTag";
import EditTag from "./EditTag";
import DeleteModal from "../Common/Modals/DeleteModal";

class Tags extends Component {

  state = {
    name:"",
    page : 0,
    totalPages:0,
    isLoading:true
  };

  getTags = (search) => {

    this.setState({
      isLoading: true
    });

    let {getTags,dispatch,user,alertify} = this.props;

    getTags(user.accessToken,search).then(res => {

        this.setState({
          page:res.data.meta.current_page,
          totalPages:res.data.meta.last_page,
        });

        dispatch({
          type: actions.GET_TAGS,
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

    this.getTags(search);
  }

  next = () => {
    let next = this.state.page + 1;
    if(next <= this.state.totalPages){
      let search = getSearchUrlFromState(this.state);
      this.getTags(search+"page="+next);
    }
  };

  previous = () => {
    let previous = this.state.page - 1;
    if(previous > 0){
      let search = getSearchUrlFromState(this.state);
      this.getTags(search+"page="+previous);
    }
  };

  renderEditCell = (isHead = true,tag = null) => {
    const {ability} = this.props;
    if(ability('tag-edit')) {
      return isHead ? <th>Edit</th>:<td><EditTag {...this.props} tag={tag}/></td>;
    }
  };

  renderDeleteCell = (isHead = true,tag = null) => {
    const {ability} = this.props;
    if(ability('tag-delete')) {
      return isHead?<th>Delete</th>:<td><DeleteModal model={tag.name+" Tag"} delete={()=>this.deleteTag(tag.id)}/></td>;
    }
  };

  renderBody = () => {

    if(this.state.isLoading) {
      return ;
    }

    return this.props.tags.map(m => {

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
    this.getTags(search);
  };

  deleteTag(id){

    let {user,deleteTag,dispatch,alertify} = this.props;

    deleteTag(user.accessToken,id).then(res => {
      dispatch({
        type: actions.DELETE_TAGS,
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
                    <i className="fa fa-align-justify" /> Tags - Page {page} of {totalPages}
                  </Col>

                  <Col md="1.5">
                    <CreateTag {...this.props}/>
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
    tags: state.tags.tags,
  };
};

const mapDispatchToProps = () => {
  return {
    getTags: (token,search) => actions.getTags(token,search),
    deleteTag: (token,id) => actions.deleteTag(token,id)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tags);
