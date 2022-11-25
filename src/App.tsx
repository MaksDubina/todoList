import {AppBar, Button, Container, IconButton, Toolbar, Typography} from '@mui/material';
import React from 'react';
import './App.css';
import {Menu} from "@mui/icons-material";
import {TaskType} from "./api/todolists-api";
import {TodolistList} from "./components/TodolistList";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    return (
        <div className="App">
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
            </AppBar>
            <Container fixed>
                <TodolistList/>
            </Container>
        </div>
    );
}

export default App;
