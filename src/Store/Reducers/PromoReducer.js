import * as actions from "../Actions/PromoActions";

const initSate = {
  promos : []
};

const PromoReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_PROMOS: {
      return { ...state, promos: action.payload };
    }
    case actions.CREATE_PROMO: {
      return { ...state, promos: [{...action.payload},...state.promos] };
    }
    case actions.EDIT_PROMO: {
      let promo = action.payload;
      let promos = state.promos.map( v => {
        if(v.id === promo.id){
          return {...promo}
        }
        return {...v}
      });
      return { ...state, promos: promos };
    }
    case actions.DELETE_PROMO: {
      let promos = state.promos.filter( v => v.id !== action.payload);
      return { ...state, promos: promos };
    }
  }
  return state;
};

export default PromoReducer;
