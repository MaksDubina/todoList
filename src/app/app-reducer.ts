//app-reducer.tsx


import {authAPI} from "../api/todolists-api";
import {Dispatch} from "redux";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as AppErrorType,
    isInitialized: false as boolean
}


export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.valueInitialized}
        default:
            return state
    }
}

// action
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: AppErrorType) => ({type: 'APP/SET-ERROR', error} as const)
export const setIsInitializedAC = (valueInitialized: boolean) => ({
    type: 'APP/SET-INITIALIZED',
    valueInitialized
} as const)
//thunk
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
            } else {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setIsInitializedAC(true))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(setIsInitializedAC(true))
        })
}

// type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = typeof initialState
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type AppErrorType = string | null
type ActionsType =
    | SetAppStatusActionType
    | SetAppErrorACType
    | ReturnType<typeof setIsInitializedAC>
