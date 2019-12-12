import * as actions from "../Actions/MetaDataActions";

const initSate = {
  paymentMethods : [],
  deliveryTypes:[],
  promoTypes:[],
  productTypes:[],
  restaurantsStatuses:[],
  orderStatuses:[],
  settings:[],
};

const MetaDataReducer = (state = initSate, action) => {

  switch (action.type) {

    case actions.GET_META_DATA: {
      let paymentMethods = action.payload.paymentMethods;
      let deliveryTypes = action.payload.deliveryTypes;
      let promoTypes = action.payload.promoTypes;
      let restaurantsStatuses = action.payload.restaurantsStatuses;
      let orderStatuses = action.payload.orderStatuses;
      let productTypes = action.payload.productTypes;
      return {...state,
        paymentMethods,
        deliveryTypes,
        promoTypes,
        restaurantsStatuses,
        orderStatuses,
        productTypes
      };
    }

    case actions.GET_SETTINGS:{
      return {...state,settings:action.payload};
    }

    case actions.EDIT_SETTINGS:{
      return {...state,settings:action.payload};
    }
  }
  return state;
};

export default MetaDataReducer;
