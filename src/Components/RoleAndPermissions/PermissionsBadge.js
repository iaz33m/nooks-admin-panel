import React, { Component } from "react";
import {
  Button,
  Collapse,
  Badge
} from "reactstrap";

class PermissionsBadge extends Component{

  state = {
    isOpen:true,
  };

  toggle = () => {
    this.setState({isOpen:!this.state.isOpen});
  };

  renderButton = () => {

    let {permissions} = this.props;

    if(permissions.length !== 0){
      return (
        <Button className="m-0 p-0" color="link" aria-controls="exampleAccordion1" onClick={this.toggle}>
          {(this.state.isOpen)?"Hide":"Show"}
        </Button>
      );
    }
  };

  render(){
    let {permissions} = this.props;
    return (
      <div className="item">
        <Collapse isOpen={this.state.isOpen}>
          {permissions.map(p => <Badge key={p.id} color="danger" style={{ margin: '.2rem',padding: '.3rem' }}>{p.name}</Badge>)}
        </Collapse>
        {this.renderButton()}
      </div>
    );
  }
}

export default PermissionsBadge
