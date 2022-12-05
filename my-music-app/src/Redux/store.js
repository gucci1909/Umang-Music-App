import { legacy_createStore, combineReducers,applyMiddleware,compose } from "redux";
import thunk from "redux-thunk"
import {login_reducer} from "./LoginRedux/login.reducer"
import { signup_Reducer } from "./SignupRedux/signup.reducer";

const rootReducer = combineReducers({
    login : login_reducer,
    signup:signup_Reducer
})

const createComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = legacy_createStore(rootReducer, createComposer(applyMiddleware(thunk)))