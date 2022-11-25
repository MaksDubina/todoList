import React from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {EditableSpan} from "./EditableSpan";
import {TaskStatuses, TaskType} from "../api/todolists-api";


type TaskPropsType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
}

const Task = (props: TaskPropsType) => {

    const TaskStatuses = {
        Completed: ''
    }

    const onClickHandler = () => {

    }

    const onTitleChangeHandler = () => {

    }

    return (
        <div
            //className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}
        >
            <Checkbox
                //checked={props.task.status === TaskStatuses.Completed}
                color="primary"
                //onChange={onChangeHandler}
            />

            <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
            <IconButton onClick={onClickHandler}>
                <Delete/>
            </IconButton>
        </div>
    );
};

export default Task;