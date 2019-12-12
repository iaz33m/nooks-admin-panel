import React, {Component} from "react";
import {
  Col,
  Row,
  ListGroup, ListGroupItem,
  FormGroup,
  Progress,Button
} from 'reactstrap';

import * as actions from "../../Store/Actions/MediaActions";
import {connect} from "react-redux";
import './CreateMedia.css';

class CreateMedia extends Component {

  state = {
    files:[],
    rest_id:this.props.rest_id
  };

  onChange = e => {

    let {user,create,dispatch,alertify,rest_id} = this.props;

    const files = Object.values(e.target.files);

    this.setState({
      files:files.map(file => {
        const path = URL.createObjectURL(file);
        return {file,path,progress:0};
      })
    });

    files.forEach((file,i) => {

      const fd = new FormData();

      fd.append('image',file,file.name);
      fd.append('rest_id',rest_id);
      fd.append('caption',"");
      fd.append('alt',"");

      create(user.accessToken,fd,pEvent => {
        const progress = Math.round(pEvent.loaded/pEvent.total * 100);
        let constFiles = this.state.files.map((v,index) => (i === index)?{...v,progress}:{...v});
        this.setState({
          files:constFiles
        })
      }).then(res => {
        dispatch({
          type: actions.CREATE_MEDIA,
          payload: res.data.data
        });
      }).catch(({response}) => {
        alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
      });

    });
  };


  renderProgress = f => {

    const style = {top:'50%', position: 'relative',marginTop: '-10px',};

    if(f.progress === 100){
      return <p style={style}>Uploaded Successfully.</p>
    }
    return <Progress style={style} animated color="success" value={f.progress}>{`${f.progress} %`}</Progress>
  };

  inputClick = () => {
    this.fInput.click()
  };

  render(){
    const {files} = this.state;
    const {upBtnSize} = this.props;

    const style = {margin:'2px',padding:'5px'};

    return (
      <React.Fragment>
        <FormGroup>
          <Row className='uploadArea' onClick={this.inputClick}>
            <input style={{display:'none'}} type="file" onChange={this.onChange} multiple ref={fInput => this.fInput = fInput}/>
            <Col  sm={{ size: 4, offset: 4 }} className="text-center">
              <Button block color="success" size={upBtnSize}  className="btn-pill mt-3"> <i className="fa fa-upload"/> Upload Images</Button>
              <p style={{color:"#6D7987",fontSize:"12px", marginTop:"5px"}}>Size 400x200</p>
            </Col>
          </Row>
        </FormGroup>

        <ListGroup >
          <div style={{overflowY:'scroll',overflowX:'hidden',...this.props.style}}>
            {files.map((f,i) =>(
              <ListGroupItem style={style} key={i}>
                <Row>
                  <Col xs="4">
                    <img className="img img-responsive" style={{width:'100%'}} src={f.path}/>
                  </Col>
                  <Col xs="8">
                    {this.renderProgress(f)}
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
          </div>
        </ListGroup>

      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    create: (token,params,progressHandler) => actions.createMedia(token,params,progressHandler),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateMedia);
