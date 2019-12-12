import * as actions from "../Actions/OrderActions";

const initSate = {
  orders : []
};

const OrderReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.GET_ORDERS: {
      return { ...state, orders: action.payload };
    }
    case actions.EDIT_ORDER: {
      let order = action.payload;
      let orders = state.orders.map( v => {
        if(v.id === order.id){
          return {...order}
        }
        return {...v}
      });
      return { ...state, orders };
    }
  }
  return state;
};

export default OrderReducer;
