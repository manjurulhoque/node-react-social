import { Action, InitialState, UserInitialState } from './../interfaces/states';
import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS
} from "../constants/userConstants"
import { isAuthenticatedFromToken } from "../utils/is-authenticated";

const initState: UserInitialState = {
    loading: false
}

export const userLoginReducer = (state: UserInitialState = initState, action: Action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true }
        case USER_LOGIN_SUCCESS:
            let isAuthenticated = isAuthenticatedFromToken(action.payload.token);
            return { loading: false, userInfo: action.payload, isAuthenticated: isAuthenticated }
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload }
        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}

export const userRegisterReducer = (state = {}, action: Action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true }
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}