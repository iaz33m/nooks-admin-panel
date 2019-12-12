import * as actions from "../Actions/AuthActions";

const initSate = {
  user : (localStorage.user)? JSON.parse(localStorage.user):null,
  permissions:[],
};

const AuthReducer = (state = initSate, action) => {

  switch (action.type) {

    case actions.LOGIN: {
      let user = {...action.payload,accessToken:action.payload.access_token};
      localStorage.user = JSON.stringify(user);
      return { ...state, user: user };
    }

    case actions.LOGOUT: {
      localStorage.user = null;
      return { ...state, user: null };
    }

    case actions.GET_AUTH_PERMISSIONS: {
      return { ...state, permissions: action.payload };
    }

  }
  return state;
};

export default AuthReducer;
