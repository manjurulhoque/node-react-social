import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';

import { userLoginReducer, userRegisterReducer } from './reducers/userReducers';
import { isAuthenticatedFromToken } from './utils/is-authenticated';
import { InitialState } from './interfaces/states';

const rootReducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer
});

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') || '')
    : null

let isAuthenticated = false;

if (userInfoFromStorage && userInfoFromStorage.token) {
    isAuthenticated = isAuthenticatedFromToken(userInfoFromStorage.token)
}

const initialState: InitialState = {
    userLogin: {
        userInfo: userInfoFromStorage,
        isAuthenticated: isAuthenticated
    },
}

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export type RootState = ReturnType<typeof rootReducer>;
// export type AppStore = ReturnType<typeof store>;
// export type AppDispatch = AppStore['dispatch'];

export type AppDispatch = typeof store.dispatch;

export default store;