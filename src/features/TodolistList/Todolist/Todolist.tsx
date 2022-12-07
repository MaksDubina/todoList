import React, {useCallback, useEffect} from 'react';
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {AddItemForm} from "../../../components/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {Task} from "./Task/Task";
import {useAppDispatch} from "../../../app/store";
import {fetchTaskTC} from "../tasks-reducer";
import {FilterValuesType, TodolistDomainType} from "../todolists-reducer";

type PropsType = {
    todolist: TodolistDomainType
    // id: string
    // entityStatus: RequestStatusType
    tasks: Array<TaskType>
    // title: string
    addTask: (id:string, title: string) =>void
    removeTask:(taskId: string, todolistId: string) =>void
    // filter: FilterValuesType
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, title: string) => void
    changeTaskTitle: (taskId: string, title: string, todolistId: string) =>void
    changeTaskStatus:(id: string, status: TaskStatuses, todolistId: string) =>void
}

export const Todolist = React.memo((props: PropsType) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTaskTC(props.todolist.id))
    }, [])

    const removeTodolist = () => {
        props.removeTodolist(props.todolist.id)
    }

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolist.id, title)
    }, [props.todolist.id, props.changeTodolistTitle])

    const addTask = useCallback((title: string) => {
        props.addTask(props.todolist.id, title)
    }, [props.addTask, props.todolist.id])


    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.todolist.id), [props.todolist.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.todolist.id), [props.todolist.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.todolist.id), [props.todolist.id, props.changeFilter])

    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div style={{width: '300px'}}>
            <h3>
                <EditableSpan value={props.todolist.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus==='loading'}/>
            {tasksForTodolist && tasksForTodolist.map((t) => {
                return (
                    <Task
                        key={t.id}
                        task={t}
                        todolistId={props.todolist.id}
                        removeTask={props.removeTask}
                        changeTaskTitle={props.changeTaskTitle}
                        changeTaskStatus={props.changeTaskStatus}
                    />
                )
            })}
            <div style={{paddingTop: '10px'}}>
                <Button
                    variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
                >All
                </Button>
                <Button
                    variant={props.todolist.filter === 'active' ? 'outlined' : 'text'} onClick={onActiveClickHandler}
                    color={'primary'}>Active
                </Button>
                <Button
                    variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
                </Button>
            </div>
        </div>
    )
});