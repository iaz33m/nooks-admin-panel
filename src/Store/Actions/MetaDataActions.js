
import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_META_DATA = "GET_META_DATA";
export const GET_SETTINGS = "GET_SETTINGS";
export const EDIT_SETTINGS = "EDIT_SETTINGS";


export const getMetaData = () => {
  return axios.get(APIModel.HOST + "site/metaData",{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json'
    }
  });
};

export const getSettings = (token) => {
  return axios.get(APIModel.HOST + "admin/settings",{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};


export const editSettings = (token,settings) => {

  console.log("token",token);
  console.log("settings",settings);

  let params = {
    settings: settings
  };

  return axios.put(APIModel.HOST + "admin/settings",params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
