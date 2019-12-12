import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_RESTAURANTS = "GET_RESTAURANTS";
export const CREATE_RESTAURANT = "CREATE_RESTAURANT";
export const EDIT_RESTAURANT = "EDIT_RESTAURANT";

export const getRestaurants = (token,search) => {
  return axios.get(APIModel.HOST + "admin/restaurants" +search,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const createRestaurant = (token,params) => {
  return axios.post(APIModel.HOST + "admin/restaurants",params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const showRestaurant = (token,id) => {
  return axios.get(APIModel.HOST + "admin/restaurants/"+id,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const editRestaurant = (token,id,params) => {

  return axios.put(APIModel.HOST + "admin/restaurants/"+id,params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
