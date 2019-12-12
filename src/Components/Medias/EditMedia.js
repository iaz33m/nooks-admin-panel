import React, {Component} from "react";
import { connect } from "react-redux";
import {
  FormGroup,
  Input,InputGroup,InputGroupAddon,
  Label,
  Button,
  Col,Row,Progress
} from 'reactstrap';


import * as actions from "../../Store/Actions/MediaActions";

import ClipboardJS from "clipboard";

new ClipboardJS('.btn');

class EditMedia extends Component {

  state = {
    ...this.props.media,
    progress:0,
    processing:false,
  };

  getCapAlt = (media) =>{
    const {caption,alt} = media;
    return {
      caption:(caption)?caption:"",
      alt:(alt)?alt:"",
      icon:null,
      copyStatus:'',
    };
  };

  componentWillMount(){
    const {media} = this.props;
    this.setState({
      ...this.getCapAlt(media)
    });
  }

  componentWillReceiveProps(nextProps) {
    const {media:oldMedia} = this.props;
    const {media:newMedia} = nextProps;
    if(!oldMedia || (oldMedia.id !== newMedia.id)){
      this.setState({...newMedia,...this.getCapAlt(newMedia),copyStatus:''})
    }
  }

  edit = () => {

    this.setState({
      processing:true
    });

    let {user,edit,dispatch,alertify} = this.props;
    let {id,name,caption,alt,rest_id,image,} = this.state;


    let fd = new FormData();

    fd.append('name',name);
    fd.append('caption',caption);
    fd.append('alt',alt);
    fd.append('rest_id',rest_id);

    if(image){
      fd.append('image',image,image.name);
    }

    edit(user.accessToken,id,fd,pEvent => {
      const progress = Math.round(pEvent.loaded/pEvent.total * 100);
      this.setState({
        progress,
      });
    }).then(res => {
      const media = res.data.data;
      dispatch({
        type: actions.EDIT_MEDIA,
        payload: media,
      });

      this.setState({
        ...media,
        ...this.getCapAlt(media)
      });

      alertify.success(res.data.message);

    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    }).finally(()=>{
      this.setState({
        processing:false
      });
    });

  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onFileChange = e => {
    const image = e.target.files[0];
    const icon = URL.createObjectURL(image);
    this.setState({image,icon,progress:1});
  };

  renderProgressContainer = progress => {
    const {icon,processing} = this.state;
    if(icon){
      return (
        <FormGroup>
          <Col xs="12">
            {(processing)?<Progress animated color="success" value={progress-1}>{`${progress-1} %`}</Progress>:""}
          </Col>
        </FormGroup>
      );
    }
  };


  renderEditMediaButton = () => {
    const {ability} = this.props;
    const {processing} = this.state;

    if(ability('media-edit')){
      return (
        <Col xs="4">
          <Button color="primary" onClick={this.edit} disabled={processing}>
            <i className='fa fa-pencil'/> {(processing)?"Updating...":"Update"}
          </Button>{' '}
        </Col>
      );
    }
  };

  renderUpdateMediaButton = () => {
    const {ability} = this.props;

    if(ability('media-edit')){
      return (
        <FormGroup>
          <Row className='uploadArea' onClick={()=>this.fInput.click()}>
            <input style={{display:'none'}} type="file" onChange={this.onFileChange} ref={fInput => this.fInput = fInput}/>
            <Col  sm={{ size: 6, offset: 3 }} className="text-center">
              <Button block color="success" size="sm"  className="btn-pill mt-3"> <i className="fa fa-upload"/> Upload Image</Button>
              <p style={{color:"#6D7987",fontSize:"12px", marginTop:"5px"}}>Size 400x200</p>
            </Col>
          </Row>
        </FormGroup>
      );
    }
  };

  render(){

    const {path,icon,name,caption,alt,copyStatus,progress} = this.state;

    return (
      <React.Fragment>

        <FormGroup>
          <Col xs="12" sm="12">
            <a href={path} target="_blank"><img width="100%" className="img img-responsive img-thumbnail" src={(icon)?icon:path}/></a>
          </Col>
        </FormGroup>

        {this.renderUpdateMediaButton()}

        <FormGroup>
          <Col xs="12">
            <Label htmlFor="alt">Image Path</Label>
            <InputGroup>
              <Input id="image-path" type="text" value={path} readOnly />
              <InputGroupAddon addonType="append">
                <Button
                  title="Copy Image Path"
                  type="button"
                  color="success"
                  data-clipboard-target="#image-path"
                  onClick={()=>this.setState({copyStatus:"Copied !"})}>
                  <i className="fa fa-clipboard"/>
                </Button>
              </InputGroupAddon>
              <InputGroupAddon addonType="append">
                <Label style={{margin:"5px",width:"50px"}} >{copyStatus}</Label>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col xs="12">
            <Label htmlFor="name">Name</Label>
            <Input type="text" name="name" placeholder="Name" value={name} onChange={this.onChange} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col xs="12">
            <Label htmlFor="caption">Caption</Label>
            <Input type="text" name="caption" placeholder="Caption" value={caption} onChange={this.onChange} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col xs="12">
            <Label htmlFor="alt">Alt Text</Label>
            <Input type="text" name="alt" placeholder="Alt Text" value={alt} onChange={this.onChange} />
          </Col>
        </FormGroup>

        {this.renderProgressContainer(progress)}

        <FormGroup>
          <Row>
            {this.renderEditMediaButton()}
            <Col xs="8">
              {this.props.children}
            </Col>
          </Row>
        </FormGroup>

      </React.Fragment>
    );
  }
}

const mapDispatchToProps = () => {
  return {
    edit: (token,id,params,progressHandler) => actions.editMedia(token,id,params,progressHandler),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(EditMedia);
