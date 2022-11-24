import React from 'react';
import {Button, Checkbox, IconButton, TextField} from "@mui/material";
import {AddBox, Delete} from "@mui/icons-material";
import {AddItemForm} from "./AddItemForm";

export const Todolist = () => {

    let Tasks = ['task', "task", "task"]

    return (
        <div style={{width: '300px'}}>
            <h3>
                {/*<EditableSpan />*/}
                Name List
                <IconButton
                    // onClick={{}}
                >
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm/>
            {Tasks.map(() => {
                return (
                    <div style={{display: 'flex', margin: '15px 0'}}>
                        <Checkbox/>
                        <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
                        <IconButton>
                            <Delete/>
                        </IconButton>
                    </div>
                )
            })}
            <div style={{paddingTop: '10px'}}>
                <Button
                    //variant={props.filter === 'all' ? 'outlined' : 'text'}
                    //onClick={onAllClickHandler}
                    color={'inherit'}
                >All
                </Button>
                <Button
                    //variant={props.filter === 'active' ? 'outlined' : 'text'}
                    //onClick={onActiveClickHandler}
                    color={'primary'}>Active
                </Button>
                <Button
                    //variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    //onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
                </Button>
            </div>
        </div>
    )
};