import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_PRODUCT_TYPES = "GET_PRODUCT_TYPES";
export const CREATE_PRODUCT_TYPES = "CREATE_PRODUCT_TYPES";
export const EDIT_PRODUCT_TYPES = "EDIT_PRODUCT_TYPES";
export const DELETE_PRODUCT_TYPES = "DELETE_PRODUCT_TYPES";

export const getProductTypes = (token,search) => {
  return axios.get(APIModel.HOST + "admin/productTypes" +search,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const createProductType = (token,name) => {
  return axios.post(APIModel.HOST + "admin/productTypes",{
    name:name
  },{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const editProductType = (token,id,data) => {
  return axios.put(APIModel.HOST + "admin/productTypes/"+id,data,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const deleteProductType = (token,id) => {
  return axios.delete(APIModel.HOST + "admin/productTypes/"+id,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
