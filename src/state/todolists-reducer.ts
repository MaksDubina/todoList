import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {setAppStatusAC, SetAppStatusActionType} from "../app/app-reducer";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.todolists.map(td => ({...td, filter: 'all'}))
        case 'ADD-TODOLIST':
            return [action.todolist, ...state]
        case 'REMOVE-TODOLIST':
            return state.filter(td => action.id !== td.id)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(td => action.id === td.id ? {...td, title: action.title} : td)
        case 'CHANGE-FILTER':
            return state.map(td => action.id === td.id? {...td, filter: action.newFilter} :td)
        default:
            return state
    }
}
//action
const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
const changeTodolistTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistFilterAC = (id:string, newFilter:FilterValuesType) => ({type:'CHANGE-FILTER', id, newFilter} as const)

//thunk
export const addTodolistTC = (title: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const fetchTodolistsTC = () => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export const removeTodolistTC = (id: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.deleteTodolist(id)
            .then(() => {
                dispatch(removeTodolistAC(id))
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
            })
    }
}
//type
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type setTodolistsActionType = ReturnType<typeof setTodolistsAC>
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType>
type ActionsType =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | AddTodolistActionType
    | setTodolistsActionType

