import React, {useEffect, useState} from 'react';
import {Grid, Paper} from "@mui/material";
import {Todolist} from "./Todolist";
import {AddItemForm} from "./AddItemForm";
import {useDispatch, useSelector} from "react-redux";
import {fetchTodolistsTC, TodolistDomainType} from "../state/todolists-reducer";
import {AppRootStateType, useAppDispatch, useAppSelector} from "../state/store";

export const TodolistList = () => {

    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const dispatch = useAppDispatch()

    useEffect(()=> {
        dispatch(fetchTodolistsTC())
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
                            <Todolist/>
                        </Paper>
                    </Grid>
                })}
            </Grid>
        </div>
    );
};
