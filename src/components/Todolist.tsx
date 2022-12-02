import React, {useCallback, useEffect} from 'react';
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {TaskStatuses, TaskType} from "../api/todolists-api";
import {Task} from "./Task";
import {useAppDispatch} from "../state/store";
import {addTaskTC, fetchTaskTC, removeTaskTC, updateTaskTC} from "../state/tasks-reducer";

type PropsType = {
    id: string
    tasks: Array<TaskType>
    title: string
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, title: string) => void
}

export const Todolist = (props: PropsType) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTaskTC(props.id))
    }, [])

    const removeTodolist = () => {
        props.removeTodolist(props.id)
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title)
    }, [props.id, props.changeTodolistTitle])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(props.id, title))
    }, [])
    const removeTask = (taskId: string, todolistId: string) => {
        dispatch(removeTaskTC(todolistId, taskId))
    }
    const changeTaskTitle = (taskId: string, title: string, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, taskId, {title}))
    }
    const changeTaskStatus = (id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, id, {status}))
    }

    return (
        <div style={{width: '300px'}}>
            <h3>
                <EditableSpan value={props.title} onChange={changeTodolistTitle}/>

                <IconButton onClick={removeTodolist}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            {props.tasks && props.tasks.map((t) => {
                return (
                    <Task
                        key={t.id}
                        task={t}
                        todolistId={props.id}
                        removeTask={removeTask}
                        changeTaskTitle={changeTaskTitle}
                        changeTaskStatus={changeTaskStatus}
                    />
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