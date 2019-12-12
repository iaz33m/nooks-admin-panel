import * as actions from "../Actions/RestaurantsActions";

const initSate = {
  restaurants : []
};

const RestaurantReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_RESTAURANTS: {
      return { ...state, restaurants: action.payload };
    }
    case actions.CREATE_RESTAURANT: {
      return { ...state, restaurants: [{...action.payload},...state.restaurants] };
    }
    case actions.EDIT_RESTAURANT: {
      let rest = action.payload;
      let restaurants = state.restaurants.map( v => {
        if(v.id === rest.id){
          return {...rest}
        }
        return {...v}
      });
      return { ...state, restaurants };
    }
  }
  return state;
};

export default RestaurantReducer;
