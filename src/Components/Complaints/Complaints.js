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
import * as actions from "../../Store/Actions/ComplaintActions";

import { getSearchUrlFromState } from '../../util/functions'

import CreateComplaint from "./CreateComplaint";
import EditComplaint from "./EditComplaint";
import DeleteModal from "../Common/Modals/DeleteModal";

class Complaints extends Component {

  state = {
    name: "",
    page: 0,
    totalPages: 0,
    isLoading: true
  };

  getComplaints = (search) => {

    this.setState({
      isLoading: true
    });

    let { getComplaints, dispatch, user, alertify } = this.props;

    getComplaints(user.accessToken, search).then(res => {

      this.setState({
        page: res.data.meta.current_page,
        totalPages: res.data.meta.last_page,
      });

      dispatch({
        type: actions.GET_COMPLAINTS,
        payload: res.data.data
      });

    }).catch(({ response }) => {
      alertify.alert('Error ' + response.status + ' - ' + response.statusText, response.data.message);
    }).finally(() => {

      this.setState({
        isLoading: false
      });

    });
  };

  componentDidMount() {

    let search = this.props.location.search;

    const params = qs.parse(search);

    if (params.name) {
      this.setState({
        name: params.name
      });
    }

    this.getComplaints(search);
  }

  next = () => {
    let next = this.state.page + 1;
    if (next <= this.state.totalPages) {
      let search = getSearchUrlFromState(this.state);
      this.getComplaints(search + "page=" + next);
    }
  };

  previous = () => {
    let previous = this.state.page - 1;
    if (previous > 0) {
      let search = getSearchUrlFromState(this.state);
      this.getComplaints(search + "page=" + previous);
    }
  };

  renderEditCell = (isHead = true, complaint = null) => {
    const { ability } = this.props;
    if (ability('complaint-edit')) {
      return isHead ? <th>Edit</th> : <td><EditComplaint {...this.props} complaint={complaint} /></td>;
    }
  };

  renderDeleteCell = (isHead = true, complaint = null) => {
    const { ability } = this.props;
    if (ability('complaint-delete')) {
      return isHead ? <th>Delete</th> : <td><DeleteModal model={"complaint with id " + complaint.id} delete={() => this.deleteComplaint(complaint.id)} /></td>;
    }
  };

  renderBody = () => {

    if (this.state.isLoading) {
      return;
    }

    return this.props.complaints.map(m => {

      return (<tr key={m.id}>
        <td>{m.id}</td>
        <td>{m.description}</td>
        <td>{m.type}</td>
        <td>{m.status}</td>
        {this.renderEditCell(false, m)}
        {this.renderDeleteCell(false, m)}
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
    this.getComplaints(search);
  };

  deleteComplaint(id) {

    let { user, deleteComplaint, dispatch, alertify } = this.props;

    deleteComplaint(user.accessToken, id).then(res => {
      dispatch({
        type: actions.DELETE_COMPLAINTS,
        payload: id
      });
      alertify.success(res.data.message);
    }).catch(({ response }) => {
      alertify.alert('Error ' + response.status + ' - ' + response.statusText, response.data.message);
    });
  }

  render() {

    let { page, totalPages } = this.state;

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
                    <CreateComplaint {...this.props} />
                  </Col>

                  <Col md="5">
                    <InputGroup>

                      <Input type="text" placeholder="Name" name="name" onChange={this.onChange} value={this.state.name} />

                      <InputGroupAddon addonType="append">
                        <Button type="button" color="warning" onClick={this.filter}><i className="fa fa-filter" /> Filter</Button>
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
                      <th>Description</th>
                      <th>Type</th>
                      <th>Status</th>
                      {this.renderEditCell()}
                      {this.renderDeleteCell()}
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderBody()}
                  </tbody>
                </Table>

                <SimplePagination next={this.next} previous={this.previous} />

              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    complaints: state.complaints.complaints,
  };
};

const mapDispatchToProps = () => {
  return {
    getComplaints: (token, search) => actions.getComplaints(token, search),
    deleteComplaint: (token, id) => actions.deleteComplaint(token, id)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Complaints);
