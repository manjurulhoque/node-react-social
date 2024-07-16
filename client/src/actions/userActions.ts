import AxiosConfig from '../AxiosConfig';
import {
    USER_DETAILS_RESET,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
} from '../constants/userConstants';
import { AppDispatch } from '../store';

export const login = (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
            payload: undefined
        })

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data } = await AxiosConfig.post(
            '/auth/login',
            { email, password },
            config
        )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error: any) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

export const logout = () => (dispatch: AppDispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({ type: USER_LOGOUT, payload: undefined })
    dispatch({ type: USER_DETAILS_RESET, payload: undefined })
}

export const register = (name: string, email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
            payload: undefined
        })

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data } = await AxiosConfig.post(
            '/auth/register',
            { name, email, password },
            config
        )

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        })

    } catch (error: any) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}