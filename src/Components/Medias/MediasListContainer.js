import React, {Component} from "react";
import {
  Col,Row,
  CardHeader,CardBody,Card
} from 'reactstrap';

import connect from "react-redux/es/connect/connect";
import * as actions from "../../Store/Actions/MediaActions";
import Medias from "./Medias";
import RestaurantSelect from "../Restaurants/RestaurantSelect";
import EditMedia from "./EditMedia";
import DeleteModal from "../Common/Modals/DeleteModal";

class MediasListContainer extends Component {

  state = {
    rest_id:null
  };

  renderDeleteMediaButton = (media) => {
    const {ability} = this.props;
    if(ability('media-delete')){
      return <DeleteModal model="Media" delete={()=>this.deleteMedia(media.id)}/>;
    }
  };

  renderEditMediaCom = () => {
    const {media} = this.state;
    if(media){
      return (
        <EditMedia {...this.props} media={media}>
          {this.renderDeleteMediaButton(media)}
        </EditMedia>
      );
    }else{
      return <p>Select Image from left to start editing</p>;
    }
  };

  deleteMedia = (id) => {
    let {user,deleteMedia,dispatch,alertify} = this.props;
    deleteMedia(user.accessToken,id).then(res => {
      dispatch({
        type: actions.DELETE_MEDIA,
        payload: id
      });
      this.setState({media:null});
      alertify.success(res.data.message);
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });
  };

  render(){
    const {rest_id} = this.state;
    return (
      <Row>
        <Col xs="9">
          <Card>
            <CardHeader>
              <Row>
                <Col sm="3"><strong>Medias</strong></Col>
                <Col sm="9">
                  <div style={{zIndex:"150",position:'relative'}}>
                    <RestaurantSelect autoSelect  {...this.props} onChange={(rest_id => this.setState({rest_id}))}/>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Medias {...this.props} rest_id={rest_id} style={{height: '600px'}} upBtnSize='lg' imgColSize="3" onChange={media => this.setState({media})}/>
            </CardBody>
          </Card>
        </Col>
        <Col xs="3">
          <Card>
            <CardHeader>
              <strong>Edit Media</strong>
            </CardHeader>
            <CardBody>
              {this.renderEditMediaCom()}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    edit: (token,id,params) => actions.editMedia(token,id,params),
    deleteMedia: (token,id) => actions.deleteMedia(token,id)
  };
};

export default connect(
  null,
  mapDispatchToProps
)(MediasListContainer);
