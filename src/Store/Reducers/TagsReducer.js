import * as actions from "../Actions/TagActions";

const initSate = {
  tags : []
};

const TagsReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_TAGS: {
      return { ...state, tags: action.payload };
    }
    case actions.CREATE_TAGS: {
      return { ...state, tags: [{...action.payload},...state.tags] };
    }
    case actions.EDIT_TAGS: {
      let tag = action.payload;
      let tags = state.tags.map( t => {
        if(t.id === tag.id){
          return {...tag}
        }
        return {...t}
      });
      return { ...state, tags: tags };
    }
    case actions.DELETE_TAGS: {
      let tags = state.tags.filter( t => t.id !== action.payload);
      return { ...state, tags: tags };
    }
  }
  return state;
};

export default TagsReducer;
