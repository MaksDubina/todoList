import {TasksStateType} from "../../app/App";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {Dispatch} from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todolists-api";
import {AppRootStateType} from "../../app/store";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}
export const fetchTaskTC = createAsyncThunk('tasks/fetchTask', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId);
    const task = res.data.items

    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolistId, task}

})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const response = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
    //thunkAPI.dispatch(removeTaskAC({todolistId: param.todolistId, taskId: param.taskId}))
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolistId: param.todolistId, taskId: param.taskId}

})
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

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks[index] = {...tasks[index], ...action.payload.domainModel}
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
        builder.addCase(fetchTaskTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.task
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks.splice(index, 1)
        })
    }

})


export const tasksReducer = slice.reducer
export const {addTaskAC, updateTaskAC} = slice.actions

//type
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
