export interface UserInitialState {
    loading?: boolean
    isAuthenticated?: boolean
    error?: any
    userInfo?: any
}

export interface InitialState {
    userLogin: UserInitialState
}

export interface Action {
    type: string
    payload: any
}