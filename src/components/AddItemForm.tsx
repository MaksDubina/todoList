import React from 'react';
import {IconButton, TextField} from "@mui/material";
import {AddBox} from "@mui/icons-material";

export const AddItemForm = () => {
    return (
        <div>
            <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
            <IconButton>
                <AddBox color={'primary'}/>
            </IconButton>
        </div>
    );
};

