import * as actions from "../Actions/MediaActions";

const initSate = {
  medias : []
};

const MediaReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_MEDIAS: {
      return { ...state, medias: action.payload };
    }
    case actions.CREATE_MEDIA: {
      return { ...state, medias: [{...action.payload},...state.medias] };
    }
    case actions.EDIT_MEDIA: {
      let model = action.payload;
      let medias = state.medias.map( v => {
        if(v.id === model.id){
          return {...model}
        }
        return {...v}
      });
      return { ...state, medias };
    }
    case actions.DELETE_MEDIA: {
      let medias = state.medias.filter( v => v.id !== action.payload);
      return { ...state, medias };
    }
  }
  return state;
};

export default MediaReducer;
