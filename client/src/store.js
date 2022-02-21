import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';

import { userLoginReducer, userRegisterReducer } from './reducers/userReducers';
import { isAuthenticatedFromToken } from './utils/is-authenticated';

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer
});

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

let isAuthenticated = false;

if (userInfoFromStorage && userInfoFromStorage.token) {
    isAuthenticated = isAuthenticatedFromToken(userInfoFromStorage.token)
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