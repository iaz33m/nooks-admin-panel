import React, {Component} from "react";
import { connect } from "react-redux";
import AsyncSelect from 'react-select/lib/Async';

import * as actions from "../../Store/Actions/UserActions";

class UserSelect extends Component {


  onChange = (users) => {
    let userIds = users.map(u => ({id:u.value,name:u.label}));
    let {onChange} = this.props;
    onChange(userIds);
  };

  get = (value, callback) => {
    let {get,user,alertify,withAllOption} = this.props;
    let search = "?search="+value;
    get(user.accessToken,search).then(res => {
      let rests = res.data.data.map(user => ({value:user.id,label:user.name}));
      if(withAllOption){
        rests.unshift({value:"",label:"All"});
      }
      callback(rests);
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });
  };

  render(){
    const {users} = this.props;
    return (
      <AsyncSelect
        isMulti
        cacheOptions
        defaultOptions
        defaultValue={(users)?users.map(m => ({value:m.id,label:m.name})):[]}
        loadOptions={this.get}
        {...this.props}
        onChange={this.onChange}
      />
    );
  }
}

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getUsers(token,search),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(UserSelect);
