export interface Todo{
    id: number
    title: string
    description: string
    completed: boolean
}

export interface CreateTodoInput {
    id: number
    title: string
    description: string
    completed: boolean
}

export interface UpdateTodoInput {
     id: number
    title: string
    description: string
    completed: boolean
}