import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_PROMOS = "GET_PROMOS";
export const CREATE_PROMO = "CREATE_PROMO";
export const EDIT_PROMO = "EDIT_PROMO";
export const DELETE_PROMO = "DELETE_PROMO";

export const getPromos = (token,search) => {
  return axios.get(APIModel.HOST + "admin/promos" +search,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const createPromo = (token,params) => {
  return axios.post(APIModel.HOST + "admin/promos",params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const editPromo = (token,id,params) => {
  return axios.put(APIModel.HOST + "admin/promos/"+id,params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const deletePromo = (token,id) => {
  return axios.delete(APIModel.HOST + "admin/promos/"+id,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
