import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@mui/material';
import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {Menu} from "@mui/icons-material";
import {AddItemForm} from "./components/AddItemForm";
import {TaskType} from "./api/todolists-api";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const todolists = useState([1, 2, 3]);


    return (
        <div className="App"
        >
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>

                <Grid container style={{padding: '20px'}}>
                    <AddItemForm/>
                </Grid>

                <Grid container spacing={3}>

                    {
                        todolists.map(tl => {

                            return <Grid item>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist/>
                                </Paper>
                            </Grid>

                        })
                    }


                </Grid>
            </Container>
        </div>
    );
}

export default App;
