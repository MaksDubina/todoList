import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.todolists.map(td => ({...td, filter: 'all'}))
        case 'REMOVE-TODOLIST':
            return state.filter(td => action.id !== td.id)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(td => action.id === td.id? {...td, title: action.title} :td)

        default:
            return state
    }
}
//action
const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
const changeTodolistTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)

//thunk
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        //dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                //dispatch(setAppStatusAC('succeeded'))
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

type ActionsType =
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
