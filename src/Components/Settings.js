import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,CardFooter,
  CardBody,
  CardHeader,
  Col, Input,
  Button,
  Row,
  FormGroup,
  Label
} from "reactstrap";

import * as actions from "../Store/Actions/MetaDataActions";

import {upperCaseW} from "../util/functions"

class Settings extends Component {

  state = {
    isLoading:false,
    updating:false,
    settings:[...this.props.settings]
  };

  getSettings = () => {

    this.setLoading(true);

    let {user,fetchData,dispatch,alertify} = this.props;

    fetchData(user.accessToken).then(res => {

        dispatch({
          type: actions.GET_SETTINGS,
          payload: res.data
        });

        this.setState({
          settings:res.data
        })
    }).catch(({response}) => {
        alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setLoading(false);
    });
  };

  setLoading = v =>{
    this.setState({
      isLoading: v
    });
  };
  onChange = e => {
    this.setState({
      settings:{
        ...this.state.settings,
        [e.target.name]: e.target.value,
      }
    });
  };

  saveSettings = () => {

    this.setState({
      updating:true
    });

    let {user,editSettings,dispatch,alertify} = this.props;
    let {settings} = this.state;

    editSettings(user.accessToken,settings).then(res => {
        dispatch({
          type: actions.EDIT_SETTINGS,
          payload: settings
        });
        alertify.success(res.data.message);
      })
      .catch(({response}) => {
        alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
      }).finally(()=>{
        this.setState({
          updating:false
        });
      });
  };

  componentDidMount() {
    this.getSettings();
  }

  renderCardBody(){

    let s = this.state.settings;

    let jsx = [];
    Object.keys(s).forEach(key =>{

    let text = upperCaseW(key);

      jsx.push(
        <Row key={key}>
          <Col xs="12">
            <FormGroup>
              <Label htmlFor={key}>{text}</Label>
              <Input type="text" name={key} placeholder={text} value={s[key]} required onChange={this.onChange} />
            </FormGroup>
          </Col>
        </Row>
      );
    });

    return jsx;
  }

  renderEditSettingsButton(){
    let {ability} = this.props;
    if(ability('setting-edit')){
      return (
        <CardFooter>
          <Button disabled={this.state.updating} onClick={this.saveSettings} type="submit" size="sm" color="primary"><i className="fa fa-pencil"/>
            {(this.state.updating)?" Updating...":" Update Setting"}
          </Button>
        </CardFooter>
      );
    }
  }

  render() {

    if(this.state.isLoading){
      return <p>Loading....</p>
    }

    return (<div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="12">
          <Card>
            <CardHeader>
              <strong>Settings</strong>
            </CardHeader>
            <CardBody>
              {this.renderCardBody()}
            </CardBody>
            {this.renderEditSettingsButton()}
          </Card>
        </Col>
      </Row>
    </div>);
  }
}

const mapStateToProps = state => {
  return {
    settings : state.metaData.settings
  };
};

const mapDispatchToProps = () => {
  return {
    fetchData: token => actions.getSettings(token),
    editSettings: (token,settings) => actions.editSettings(token,settings)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
