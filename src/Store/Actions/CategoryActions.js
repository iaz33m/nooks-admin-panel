import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_CATEGORIES = "GET_CATEGORIES";
export const CREATE_CATEGORY = "CREATE_CATEGORY";
export const EDIT_CATEGORY = "EDIT_CATEGORY";
export const DELETE_CATEGORY = "DELETE_CATEGORY";

export const getCategories = (token,search) => {
  return axios.get(APIModel.HOST + "admin/categories" +search,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const createCategory = (token,params) => {
  return axios.post(APIModel.HOST + "admin/categories",params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const editCategory = (token,id,params) => {
  return axios.put(APIModel.HOST + "admin/categories/"+id,params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const deleteCategory = (token,id) => {
  return axios.delete(APIModel.HOST + "admin/categories/"+id,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
