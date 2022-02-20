import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import jwt_decode from "jwt-decode";
import { composeWithDevTools } from 'redux-devtools-extension';

import { userLoginReducer } from './reducers/userReducers';

const reducer = combineReducers({
    userLogin: userLoginReducer
});

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

let isAuthenticated = false;

if (userInfoFromStorage && userInfoFromStorage.token) {
    let decoded = jwt_decode(userInfoFromStorage.token);

    isAuthenticated = new Date(decoded.exp * 1000).getTime() > new Date().getTime();
}

const initialState = {
    userLogin: {
        userInfo: userInfoFromStorage,
        isAuthenticated: isAuthenticated
    },
}

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;