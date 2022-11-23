import React from 'react';
import {Checkbox, IconButton, TextField} from "@mui/material";
import {AddBox, Delete} from "@mui/icons-material";

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
            <div>
                <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
                <IconButton
                    // onClick={{}}
                >
                    <AddBox color={'primary'}/>
                </IconButton>
            </div>

            {Tasks.map(() => {
                return (<div style={{display: 'flex', margin: '15px 0'}}>
                        <Checkbox/>
                        <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
                        <IconButton>
                            <Delete/>
                        </IconButton>
                    </div>
                )
            })}
        </div>
    )
};