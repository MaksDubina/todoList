import {TasksStateType} from "../../app/App";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todolists-api";
import {AppRootStateType} from "../../app/store";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


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

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        setTaskAC(state, action: PayloadAction<{ todolistId: string, task: TaskType[] }>) {
            state[action.payload.todolistId] = action.payload.task

        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks[index] = {...tasks[index], ...action.payload.domainModel}
        },
        removeTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks.splice(index, 1)
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        })
    }
    //{
    //     [addTodolistAC.type]: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
    //
    //     },
    //     [removeTodolistAC.type]: (state, action: PayloadAction<{ id: string }>) => {
    //     },
    //     [setTodolistsAC.type]: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
    //     },
    // }
})


export const tasksReducer = slice.reducer
export const {setTaskAC, addTaskAC, updateTaskAC, removeTaskAC} = slice.actions

//thunk
export const fetchTaskTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTaskAC({todolistId, task: res.data.items}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
    }
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                dispatch(addTaskAC({task}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}


export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
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
        dispatch(setAppStatusAC({status: 'loading'}))

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({todolistId, taskId, domainModel}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })

    }
}
export const removeTaskTC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.deleteTask(todolistId, taskId)
            .then(() => {
                dispatch(removeTaskAC({todolistId, taskId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
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
