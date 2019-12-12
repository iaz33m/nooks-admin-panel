import * as actions from "../Actions/GetTransactionsActions";

const initSate = {
  transactions : []
};

const TransactionsReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_TRANSACTIONS: {
      return { ...state, transactions: [...action.payload] };
    }
  }
  return state;
};

export default TransactionsReducer;
