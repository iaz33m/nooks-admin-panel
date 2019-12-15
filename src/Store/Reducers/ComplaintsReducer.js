import * as actions from "../Actions/ComplaintActions";

const initSate = {
  complaints: []
};

const ComplaintsReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_COMPLAINTS: {
      return { ...state, complaints: action.payload };
    }
    case actions.CREATE_COMPLAINTS: {
      return { ...state, complaints: [{ ...action.payload }, ...state.complaints] };
    }
    case actions.EDIT_COMPLAINTS: {
      let complaint = action.payload;
      let complaints = state.complaints.map(t => {
        if (t.id === complaint.id) {
          return { ...complaint }
        }
        return { ...t }
      });
      return { ...state, complaints: complaints };
    }
    case actions.DELETE_COMPLAINTS: {
      let complaints = state.complaints.filter(t => t.id !== action.payload);
      return { ...state, complaints: complaints };
    }
  }
  return state;
};

export default ComplaintsReducer;
