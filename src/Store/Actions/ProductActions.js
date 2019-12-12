import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_PRODUCTS = "GET_PRODUCTS";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const EDIT_PRODUCT = "EDIT_PRODUCT";

export const getProducts = (token,search) => {
  return axios.get(APIModel.HOST + "admin/products" +search,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const createProduct = (token,params) => {
  return axios.post(APIModel.HOST + "admin/products",params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const editProduct = (token,id,params) => {
  return axios.put(APIModel.HOST + "admin/products/"+id,params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
