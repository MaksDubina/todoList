import React, {useCallback, useEffect} from 'react';
import {Grid, Paper} from "@mui/material";
import {Todolist} from "./Todolist";
import {AddItemForm} from "./AddItemForm";
import {
    changeTodolistTitleTC,
    fetchTodolistsTC,
    removeTodolistTC,
    TodolistDomainType
} from "../state/todolists-reducer";
import {useAppDispatch, useAppSelector} from "../state/store";

export const TodolistList = () => {

    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])


    const removeTodolist = useCallback(function (id: string) {

        dispatch(removeTodolistTC(id))
    }, [])

    const changeTodolistTitle = useCallback((id:string, title: string) => {
        dispatch(changeTodolistTitleTC(id, title))
    }, [])

    const addTodolist = useCallback(() => {

    }, [])

    return (
        <div>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map(tl => {
                    console.log(tl)
                    return <Grid item>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                removeTodolist={removeTodolist}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })}
            </Grid>
        </div>
    );
};
