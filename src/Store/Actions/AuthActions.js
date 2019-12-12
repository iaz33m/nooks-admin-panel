import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_AUTH_PERMISSIONS = "GET_AUTH_PERMISSIONS";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const login = data => {
  return axios.post(APIModel.HOST + "auth/login", {
    number: data.number,
    password: data.password
  },{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json'
    }
  });
};

export const logout = token => {
  return axios.post(APIModel.HOST + "auth/logout",null,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
