import React, {Component} from "react";
import {
  Col,Row,
  ListGroup, ListGroupItem, Button,
  FormGroup,Input
} from 'reactstrap';

import * as actions from "../../Store/Actions/MediaActions";
import {connect} from "react-redux";

class MediaList extends Component {

  state = {
    activeTab:this.props.media_id,
    search:"",
    rest_id:this.props.rest_id
  };

  componentWillReceiveProps(nextProps) {
    const {rest_id} = nextProps;
    if(this.props.rest_id !== nextProps.rest_id){
      this.get(rest_id);
    }
  }

  toggle(media) {

    const {onChange} = this.props;
    if (this.state.activeTab !== media.id) {
      this.setState({
        activeTab: media.id
      });
      onChange(media);
    }
  }

  onInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
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

    if(rest_id){

      search+=`rest_id=${rest_id}`;

      dispatch({
        type: actions.GET_MEDIAS,
        payload: []
      });

      get(user.accessToken,search).then(res => {

        dispatch({
          type: actions.GET_MEDIAS,
          payload: res.data.data
        });

      }).catch(({response}) => {
        alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
      });
    }
  };

  render(){

    const {activeTab} = this.state;
    const {medias,imgColSize} = this.props;

    const style = {
      margin:'2px',padding:'5px'
    };

    return (

      <React.Fragment>
        <FormGroup style={{display:'flex'}}>
          <Col xs="6" sm="10">
            <Input type="text" name="search" placeholder="Search" value={this.state.search} onChange={this.onInputChange} />
          </Col>
          <Col xs="6" sm="2">
            <Button color="success" onClick={this.search}><i className="fa fa-search"/> Search</Button>
          </Col>
        </FormGroup>

        <ListGroup >
          <Row style={{height: '350px',overflowY:'scroll',overflowX:'hidden',display:'flex',...this.props.style}} >
            {medias.map((v)=>(
              <Col xs={imgColSize} key={v.id}>
                <ListGroupItem style={style} onClick={() => this.toggle(v)} action active={activeTab === v.id}>
                  <img className="img img-responsive" style={{width:'100%'}} src={v.path}/>
                </ListGroupItem>
              </Col>
            ))}
          </Row>

        </ListGroup>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    medias: state.medias.medias,
  };
};

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getMedias(token,search),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MediaList);

