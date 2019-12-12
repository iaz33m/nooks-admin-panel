import * as actions from "../Actions/UserActions";

const initSate = {
  users : []
};

const UsersReducer = (state = initSate, action) => {
  switch (action.type) {

    case actions.GET_USERS: {
      let users = action.payload.map(u=>{
        return {
          ...u,
          numberVerified:(u.numberVerified)?"1":"0",
          isActive:(u.isActive)?"1":"0"
        };
      });
      return { ...state, users: users };
    }

    case actions.CREATE_USER: {
      return { ...state, users: [{...action.payload},...state.users] };
    }

    case actions.EDIT_USER: {
      let user = action.payload;
      let users = state.users.map( u => {
        if(u.id === user.id){
          return {...user}
        }
        return {...u}
      });
      return { ...state, users: users };
    }

  }
  return state;
};

export default UsersReducer;
