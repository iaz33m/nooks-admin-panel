import * as actions from "../Actions/CategoryActions";

const initSate = {
  categories : {}
};

const CategoryReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_CATEGORIES: {
      const {categories,rest_id} = action.payload;
      return { ...state, categories: {...state.categories,[rest_id]:categories} };
    }
    case actions.CREATE_CATEGORY: {
      const {category,rest_id} = action.payload;
      const categories = state.categories[rest_id];
      return { ...state, categories: {...state.categories,[rest_id]:[...categories,category]} };
    }
    case actions.EDIT_CATEGORY: {
      const {category,rest_id} = action.payload;
      const categories = state.categories[rest_id];
      const updatedCats = categories.map(c => (c.id === category.id) ? {...category}:{...c});
      return { ...state, categories: {...state.categories,[rest_id]:[...updatedCats]}  };
    }
    case actions.DELETE_CATEGORY: {
      const {cat_id,rest_id} = action.payload;
      const categories = state.categories[rest_id];
      const updatedCats = categories.filter(c => c.id !== cat_id);
      return { ...state, categories: {...state.categories,[rest_id]:[...updatedCats]}  };
    }
  }
  return state;
};

export default CategoryReducer;
