import React, {useCallback, useEffect} from 'react';
import {Grid, Paper} from "@mui/material";
import {Todolist} from "./Todolist/Todolist";
import {
    addTodolistTC, changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC, FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from "./todolists-reducer";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {AddItemForm} from "../../components/AddItemForm";
import {TasksStateType} from "../../app/App";
import {addTaskTC, removeTaskTC, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {Navigate} from "react-router-dom";

export const TodolistList = React.memo(() => {

    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        dispatch(fetchTodolistsTC())
    }, [])


    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC({id: todolistId, newFilter: value}))
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC({id}))
    }, [])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(changeTodolistTitleTC({id, title}))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC({title}))
    }, [])

    const addTask = useCallback((todolistId: string, title: string) => {
        dispatch(addTaskTC({todolistId, title}))
    }, [])

    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(removeTaskTC({todolistId, taskId}))
    }, [])

    const changeTaskTitle = useCallback((taskId: string, title: string, todolistId: string) => {
        dispatch(updateTaskTC({todolistId, taskId, domainModel:{title}}))
    }, [])

    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC({todolistId, taskId, domainModel: {status}}))
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <div>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]
                    console.log(tl)
                    return <Grid item>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                //entityStatus={tl.entityStatus}
                                //id={tl.id}
                                //title={tl.title}
                                //filter={tl.filter}
                                addTask={addTask}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                tasks={allTodolistTasks}
                                removeTodolist={removeTodolist}
                                changeTodolistTitle={changeTodolistTitle}
                                changeTaskTitle={changeTaskTitle}
                                changeTaskStatus={changeTaskStatus}
                            />
                        </Paper>
                    </Grid>
                })}
            </Grid>
        </div>
    );
});
