import React, {Component} from "react";
import { connect } from "react-redux";
import AsyncSelect from 'react-select/lib/Async';

import * as actions from "../../Store/Actions/RestaurantsActions";

class RestaurantSelect extends Component {

  state = {
    value:[]
  };

  onChange = (rest) => {
    let {onChange} = this.props;
    this.setState({value:[{...rest}]});
    let value = (rest.value !== undefined)?rest.value:0;
    onChange(value);
  };

  get = (value, callback) => {
    let {get,user,alertify,autoSelect,withAllOption} = this.props;
    let search = "?search="+value;
    get(user.accessToken,search).then(res => {
      let rests = res.data.data.map(rest => ({value:rest.id,label:rest.name}));
      if(withAllOption){
        rests.unshift({value:"",label:"All Restaurants"});
      }
      callback(rests);
      if(autoSelect){
        if(rests.length > 0){
          this.onChange(rests[0]);
        }
      }
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });
  };

  render(){

    return (
      <AsyncSelect
        value={this.state.value}
        placeholder="Select Restaurant"
        cacheOptions
        loadOptions={this.get}
        defaultOptions
        onChange={this.onChange}
      />
    );
  }
}

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getRestaurants(token,search),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(RestaurantSelect);
