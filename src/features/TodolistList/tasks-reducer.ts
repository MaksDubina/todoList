import {TasksStateType} from "../../app/App";
import {AddTodolistActionType, SetTodolistsActionType} from "./todolists-reducer";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todolists-api";
import {AppRootStateType} from "../../app/store";
import {SetAppErrorACType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


const initialState: TasksStateType = {
    // "todolistId1": [
    //     { id: "1", title: "CSS", status: false, todoListId: "todolistId1", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    //     { id: "2", title: "JS", status: false, todoListId: "todolistId1", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    //     { id: "3", title: "React", status: false, todoListId: "todolistId1", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    // ],
    // "todolistId2": [
    //     { id: "1", title: "bread", status: false, todoListId: "todolistId2", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    //     { id: "2", title: "milk", status: false, todoListId: "todolistId2", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    //     { id: "3", title: "tea", status: false, todoListId: "todolistId2", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    // ]

}


export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASK': {
            return {...state, [action.todolistId]: action.task}
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.domainModel} : t)
            }

        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        }
        default:
            return state;
    }
}
//action
export const setTaskAC = (todolistId: string, task: TaskType[]) => ({type: 'SET-TASK', todolistId, task} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => ({
    type: 'UPDATE-TASK',
    todolistId,
    taskId,
    domainModel
} as const)
export const removeTaskAC = (todolistId: string, taskId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
//thunk
export const fetchTaskTC = (todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTaskAC(todolistId, res.data.items))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                dispatch(addTaskAC(task))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}


export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => {
    return (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }
        dispatch(setAppStatusAC('loading'))

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                handleServerAppError(res.data, dispatch);
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })

    }
}
export const removeTaskTC = (todolistId: string, taskId: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.deleteTask(todolistId, taskId)
            .then(() => {
                dispatch(removeTaskAC(todolistId, taskId))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

//type
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorACType>

type ActionsType =
    | SetTodolistsActionType
    | AddTodolistActionType
    | ReturnType<typeof setTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof removeTaskAC>