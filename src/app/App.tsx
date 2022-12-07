import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from '@mui/material';
import React from 'react';
import './App.css';
import {Menu} from "@mui/icons-material";
import {TaskType} from "../api/todolists-api";
import {TodolistList} from "../features/TodolistList/TodolistList";
import {useAppSelector} from "./store";
import {RequestStatusType} from "./app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const status = useAppSelector<RequestStatusType>(state => state.app.status)

    return (
        <BrowserRouter>
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            TodoLists
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path='/' element={<TodolistList/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>} />
                        <Route path='*' element={<Navigate to={'/404'}/>}/>

                    </Routes>

                </Container>
            </div>
        </BrowserRouter>
    );
}

export default App;
