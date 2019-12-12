import React, {Component} from "react";
import { connect } from "react-redux";
import AsyncSelect from 'react-select/lib/Async';

import * as actions from "../../Store/Actions/TagActions";

class TagSelect extends Component {


  onChange = (models) => {
    let modelIds = models.map(m => ({ id: m.value,name:m.label}));
    let {onChange} = this.props;
    onChange(modelIds);
  };

  get = (value, callback) => {
    let {get,user,alertify} = this.props;
    let search = "?name="+value;
    get(user.accessToken,search).then(res => {
      let rests = res.data.data.map(m => ({value:m.id,label:m.name}));
      callback(rests);
    }).catch(({response}) => {
      alertify.alert('Error '+response.status+' - '+response.statusText,response.data.message);
    });
  };

  render(){
    const {tags} = this.props;
    return (
      <AsyncSelect
        isMulti
        cacheOptions
        defaultOptions
        defaultValue={(tags)?tags.map(m => ({value:m.id,label:m.name})):[]}
        loadOptions={this.get}
        {...this.props}
        onChange={this.onChange}
      />
    );
  }
}

const mapDispatchToProps = () => {
  return {
    get: (token,search) => actions.getTags(token,search),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(TagSelect);
