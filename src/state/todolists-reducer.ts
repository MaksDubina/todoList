import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state:Array<TodolistDomainType>=initialState, action:ActionsType) => {
    switch (action.type) {
        case "SET-TODOLISTS":
            return action.todolists.map(td => ({...td, filter: 'all'}))
        default:
            return state
    }
}
//action
const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
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
//type
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType

}

type ActionsType =
    | ReturnType<typeof setTodolistsAC>