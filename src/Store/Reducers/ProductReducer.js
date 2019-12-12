import * as actions from "../Actions/ProductActions";

const initSate = {
  products : {}
};

const ProductReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_PRODUCTS: {
      const {products,cat_id} = action.payload;
      return { ...state, products: {...state.products,[cat_id]:products} };
    }
    case actions.CREATE_PRODUCT: {
      const {product,cat_id} = action.payload;
      const products = state.products[cat_id];
      return { ...state, products: {...state.products,[cat_id]:[...products,product]} };
    }
    case actions.EDIT_PRODUCT: {
      const {product,cat_id} = action.payload;
      const products = state.products[cat_id];
      const updatedProducts = products.map(p => (p.id === product.id) ? {...product}:{...p});
      return { ...state, products: {...state.products,[cat_id]:[...updatedProducts]}  };
    }
  }
  return state;
};

export default ProductReducer;
