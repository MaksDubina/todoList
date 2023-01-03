//app-reducer.tsx
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const initializeAppTC = createAsyncThunk('app/initializeApp', async (params, thunkAPI) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({value: true}));
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
        }

    } catch (error) {
        // @ts-ignore
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})


const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'succeeded' as RequestStatusType,
        error: null as AppErrorType,
        isInitialized: false as boolean
    },
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: AppErrorType }>) {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })

    }

})
//reducer
export const appReducer = slice.reducer;
// action
export const {setAppStatusAC, setAppErrorAC} = slice.actions
// type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type AppErrorType = string | null

