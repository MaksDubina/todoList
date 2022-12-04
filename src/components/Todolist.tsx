import React, {useCallback, useEffect} from 'react';
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {TaskStatuses, TaskType} from "../api/todolists-api";
import {Task} from "./Task";
import {useAppDispatch} from "../state/store";
import {fetchTaskTC} from "../state/tasks-reducer";
import {FilterValuesType} from "../state/todolists-reducer";

type PropsType = {
    id: string
    tasks: Array<TaskType>
    title: string
    addTask: (id:string, title: string) =>void
    removeTask:(taskId: string, todolistId: string) =>void
    filter: FilterValuesType
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, title: string) => void
    changeTaskTitle: (taskId: string, title: string, todolistId: string) =>void
    changeTaskStatus:(id: string, status: TaskStatuses, todolistId: string) =>void
}

export const Todolist = React.memo((props: PropsType) => {

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
        props.addTask(props.id, title)
    }, [props.addTask, props.id])


    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.id, props.changeFilter])

    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
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
            {tasksForTodolist && tasksForTodolist.map((t) => {
                return (
                    <Task
                        key={t.id}
                        task={t}
                        todolistId={props.id}
                        removeTask={props.removeTask}
                        changeTaskTitle={props.changeTaskTitle}
                        changeTaskStatus={props.changeTaskStatus}
                    />
                )
            })}
            <div style={{paddingTop: '10px'}}>
                <Button
                    variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
                >All
                </Button>
                <Button
                    variant={props.filter === 'active' ? 'outlined' : 'text'} onClick={onActiveClickHandler}
                    color={'primary'}>Active
                </Button>
                <Button
                    variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
                </Button>
            </div>
        </div>
    )
});