import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_TAGS = "GET_TAGS";
export const CREATE_TAGS = "CREATE_TAGS";
export const EDIT_TAGS = "EDIT_TAGS";
export const DELETE_TAGS = "DELETE_TAGS";

export const getTags = (token,search) => {
  return axios.get(APIModel.HOST + "admin/tags" +search,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const createTag = (token,name) => {
  return axios.post(APIModel.HOST + "admin/tags",{
    name:name
  },{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const editTag = (token,id,data) => {
  return axios.put(APIModel.HOST + "admin/tags/"+id,data,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const deleteTag = (token,id) => {
  return axios.delete(APIModel.HOST + "admin/tags/"+id,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
