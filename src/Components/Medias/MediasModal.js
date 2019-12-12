import React,{Component} from "react";
import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal
} from 'reactstrap';
import Medias from "./Medias";

class MediasModal extends Component{

  state = {
    isOpen:false,
    media:this.props.media
  };

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };

  render(){

    const {style,onChange} = this.props;
    const {media,isOpen} = this.state;

    return (
      <React.Fragment>
        <Button style={style} color="warning" onClick={this.toggle} className="mr-1">
          <i className="fa fa-camera"/> Update Media
        </Button>
        <Modal isOpen={isOpen} toggle={this.toggle} className="modal-primary modal-lg">
          <ModalHeader style={{}} toggle={this.toggle}>Set Media</ModalHeader>
          <ModalBody>
            <Medias {...this.props} style={{height: '350px'}} upBtnSize='sm' imgColSize="4" onChange={media => this.setState({media})}/>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={()=>{onChange(media);this.toggle();}} >Done</Button>
            <Button onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default MediasModal;
