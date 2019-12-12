import * as actions from "../Actions/ProductTypeActions";

const initSate = {
  productTypes : []
};

const ProductTypesReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_PRODUCT_TYPES: {
      return { ...state, productTypes: action.payload };
    }
    case actions.CREATE_PRODUCT_TYPES: {
      return { ...state, productTypes: [{...action.payload},...state.productTypes] };
    }
    case actions.EDIT_PRODUCT_TYPES: {
      let productType = action.payload;
      let productTypes = state.productTypes.map( p => {
        if(p.id === productType.id){
          return {...productType}
        }
        return {...p}
      });
      return { ...state, productTypes: productTypes };
    }
    case actions.DELETE_PRODUCT_TYPES: {
      let productTypes = state.productTypes.filter( p => p.id !== action.payload);
      return { ...state, productTypes: productTypes };
    }

  }
  return state;
};

export default ProductTypesReducer;
