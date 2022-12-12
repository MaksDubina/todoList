//app-reducer.tsx
import {authAPI} from "../api/todolists-api";
import {Dispatch} from "redux";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as AppErrorType,
    isInitialized: false as boolean
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: AppErrorType }>) {
            state.error = action.payload.error
        },
        setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        },
    }
})
//reducer
export const appReducer = slice.reducer;
// action
export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC} = slice.actions
//thunk
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setIsInitializedAC({isInitialized: true}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(setIsInitializedAC({isInitialized: true}))
        })
}

// type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type AppErrorType = string | null

