import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import authReducer from "./Store/Reducers/AuthReducer";
import transactionsReducer from "./Store/Reducers/TransactionsReducer";
import metaDataReducer from "./Store/Reducers/MetaDataReducer";
import roleAndPermissionsReducer from "./Store/Reducers/RoleAndPermissionsReducer";
import tagsReducer from "./Store/Reducers/TagsReducer";
import productTypesReducer from "./Store/Reducers/ProductTypesReducer";
import usersReducer from "./Store/Reducers/UsersReducer";
import RestaurantReducer from "./Store/Reducers/RestaurantReducer";
import PromoReducer from "./Store/Reducers/PromoReducer";
import MediaReducer from "./Store/Reducers/MediaReducer";
import OrderReducer from "./Store/Reducers/OrderReducer";
import CategoryReducer from "./Store/Reducers/CategoryReducer";
import ProductReducer from "./Store/Reducers/ProductReducer";

import "./index.css";
import App from "./App";
// disable ServiceWorker
// import registerServiceWorker from './registerServiceWorker';

const rootReducer = combineReducers({
  auth: authReducer,
  transactions:transactionsReducer,
  metaData:metaDataReducer,
  roleAndPermissions:roleAndPermissionsReducer,
  tags:tagsReducer,
  productTypes:productTypesReducer,
  users:usersReducer,
  restaurants:RestaurantReducer,
  promos:PromoReducer,
  medias:MediaReducer,
  orders:OrderReducer,
  categories:CategoryReducer,
  products:ProductReducer,
});

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
// disable ServiceWorker
// registerServiceWorker();
