import {TasksStateType} from "../App";


const initialState: TasksStateType = {
    // "todolistId1": [
    //     { id: "1", title: "CSS", status: false, todoListId: "todolistId1", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    //     { id: "2", title: "JS", status: false, todoListId: "todolistId1", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    //     { id: "3", title: "React", status: false, todoListId: "todolistId1", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    // ],
    // "todolistId2": [
    //     { id: "1", title: "bread", status: false, todoListId: "todolistId2", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    //     { id: "2", title: "milk", status: false, todoListId: "todolistId2", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
    //     { id: "3", title: "tea", status: false, todoListId: "todolistId2", description: '',
    //         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    // ]

}


//export const tasksReducer = (state: TasksStateType = initialState, action: any) => {
export const tasksReducer = (state: any = initialState, action: any) => {
    switch (action.type) {
        case 'ADD-TASK': {
            return state
        }
        default:
            return state;
    }
}