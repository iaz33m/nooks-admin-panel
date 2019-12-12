import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_USERS = "GET_USERS";
export const CREATE_USER = "CREATE_USER";
export const EDIT_USER = "EDIT_USER";

export const getUsers = (token,search) => {
  return axios.get(APIModel.HOST + "admin/users" +search,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const createUser = (data) => {
  return axios.post(APIModel.HOST + "auth/register",data,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json'
    }
  });
};

export const editUser = (token,id,data) => {
  return axios.put(APIModel.HOST + "admin/users/"+id,data,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

