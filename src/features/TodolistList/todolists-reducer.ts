import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorACType,
    setAppStatusAC,
    SetAppStatusActionType
} from "../../app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(td => ({...td, filter: 'all', entityStatus: 'idle'}))
        },
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) state.splice(index, 1)
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, newFilter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.newFilter
        },
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    setTodolistsAC,
    removeTodolistAC,
    addTodolistAC
} = slice.actions

//thunk
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC({todolist: res.data.data.item}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC({error: res.data.messages[0]}))
                    } else {
                        dispatch(setAppErrorAC({error: 'Some error occurred'}))
                    }
                    dispatch(setAppStatusAC({status: 'failed'}))
                }
            })
    }
}
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC({todolists: res.data}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
    }
}

export const removeTodolistTC = (id: string) => {
    return (dispatch: Dispatch) => {
        dispatch(changeTodolistEntityStatusAC({id, status: 'loading'}))
        todolistsAPI.deleteTodolist(id)
            .then(() => {
                dispatch(removeTodolistAC({id}))
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC({id, title}))
            })
    }
}
//type
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
//export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
//export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

