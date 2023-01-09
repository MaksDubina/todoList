import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {handleServerNetworkError} from "../../utils/error-utils";

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (params, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTodolists()
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: res.data}
    } catch (err) {
        const error = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }

})

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (params: { id: string }, {
    dispatch
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const {id} = params
    dispatch(changeTodolistEntityStatusAC({id, status: 'loading'}))
    const res = await todolistsAPI.deleteTodolist(id)
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {id}

})

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolist', async (params: { id: string, title: string }, {
    dispatch,
}) => {
    const {id, title} = params
    const res = await todolistsAPI.updateTodolist(id, title)
    //dispatch(changeTodolistTitleAC({id, title}))
    return {id, title}
})

export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (params: { title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.createTodolist(params.title)
    if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolist: res.data.data.item}
    } else {
        if (res.data.messages.length) {
            dispatch(setAppErrorAC({error: res.data.messages[0]}))
        } else {
            dispatch(setAppErrorAC({error: 'Some error occurred'}))
        }
        dispatch(setAppStatusAC({status: 'failed'}))
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, newFilter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.newFilter
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(td => ({...td, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) state.splice(index, 1)
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        })
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
} = slice.actions
//type
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


