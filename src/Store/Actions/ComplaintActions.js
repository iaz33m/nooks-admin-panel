import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_COMPLAINTS = "GET_COMPLAINTS";
export const CREATE_COMPLAINTS = "CREATE_COMPLAINTS";
export const EDIT_COMPLAINTS = "EDIT_COMPLAINTS";
export const DELETE_COMPLAINTS = "DELETE_COMPLAINTS";

export const getComplaints = (token, search) => {
  return axios.get(APIModel.HOST + "admin/complaints" + search, {
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
};

export const createComplaint = (token, data) => {
  return axios.post(APIModel.HOST + "admin/complaints", data, {
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
};

export const editComplaint = (token, id, data) => {
  return axios.put(APIModel.HOST + "admin/complaints/" + id, data, {
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
};

export const deleteComplaint = (token, id) => {
  return axios.delete(APIModel.HOST + "admin/complaints/" + id, {
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
};
