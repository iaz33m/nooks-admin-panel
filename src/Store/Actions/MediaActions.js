import APIModel from "../../Models/APIModel";
import axios from "axios";

export const GET_MEDIAS = "GET_MEDIAS";
export const CREATE_MEDIA = "CREATE_MEDIA";
export const EDIT_MEDIA = "EDIT_MEDIA";
export const DELETE_MEDIA = "DELETE_MEDIA";

export const getMedias = (token,search) => {
  return axios.get(APIModel.HOST + "admin/medias" +search,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};

export const createMedia = (token,params,progressHandler) => {
  return axios.post(APIModel.HOST + "admin/medias",params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    },
    'onUploadProgress':progressHandler
  });
};

export const editMedia = (token,id,params,progressHandler) => {
  return axios.post(APIModel.HOST + "admin/medias/"+id,params,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    },
    'onUploadProgress':progressHandler
  });
};

export const deleteMedia = (token,id) => {
  return axios.delete(APIModel.HOST + "admin/medias/"+id,{
    'headers': {
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'Authorization':'Bearer '+token
    }
  });
};
