import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_ORDERS = "GET_ORDERS";
export const EDIT_ORDER = "EDIT_ORDER";

export const getOrders = (token,search) => {
  return axios.get(APIModel.HOST + "admin/orders" +search,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const showOrder = (token,id) => {
  return axios.get(APIModel.HOST + "admin/orders/" +id,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const editOrder = (token,id,params) => {
  return axios.patch(APIModel.HOST + "admin/orders/"+id,params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
