//app-reducer.tsx


const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as AppErrorType
}


export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

// action
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: AppErrorType) => ({type: 'APP/SET-ERROR', error} as const)
//thunk

// type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = typeof initialState
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>
export type AppErrorType = string | null
type ActionsType =
    | SetAppStatusActionType
    | setAppErrorACType
