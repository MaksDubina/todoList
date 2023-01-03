import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {FieldsErrorType} from "../../api/todolists-api";

export const loginTC = createAsyncThunk<{isLoggedIn:boolean}, LoginParamsType, {rejectValue:{errors:Array<string>, fieldsErrors?:Array<FieldsErrorType>}}>('auth/login', async (params:LoginParamsType,thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))

        try {
            const res = await authAPI.login(params)
            if (res.data.resultCode === 0) {
                //thunkAPI.dispatch(setIsLoggedInAC({value: true}))
                thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
                return {isLoggedIn: true}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch);
                return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch(err) {
            // @ts-ignore
            const error:AxiosError = err;
            handleServerNetworkError(error, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        }
})


const slice = createSlice({
    name: 'auth',
    initialState: {isLoggedIn: false},
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action)=> {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authReducer = slice.reducer;

export const {setIsLoggedInAC} = slice.actions

// thunks


export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({ status: 'succeeded' }))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

