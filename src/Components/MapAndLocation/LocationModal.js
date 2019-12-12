import React,{Component} from "react";
import {
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal
} from 'reactstrap';

import LocationSelector from "./LocationSelector";

class LocationModal extends Component{

  state = {
    isOpen:false,
  };

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };

  render(){
    const {onLocationChange,selectorStyle,modalStyle,style,location} = this.props;
    return (
      <React.Fragment>
        <Button style={style} color="success" onClick={this.toggle} className="mr-1">
          <i className="fa fa-location-arrow"/> Set Location
        </Button>
        <Modal  isOpen={this.state.isOpen} toggle={this.toggle} className="modal-success modal-lg">
          <ModalHeader style={{}} toggle={this.toggle}>Set Restaurant Location</ModalHeader>
          <ModalBody style={modalStyle}>
            <LocationSelector style={selectorStyle} location={location} onLocationChange={onLocationChange}/>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.toggle}>Done</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default LocationModal;
