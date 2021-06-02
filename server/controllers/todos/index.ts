import { Response, Request } from 'express';
import { ITODO } from '../../types/todo';
import Todo from '../../models/todo';

const getTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const todos: ITODO[] = await Todo.find()
        res.status(200).json({ todos })
    } catch (error) {
        throw error
    }
}

const addTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<ITODO, "name" | "description" | "status">

        const todo: ITODO = new Todo({
            name: body.name,
            description: body.description,
            status: body.status,
        })

        const newTodo: ITODO = await todo.save()
        const allTodos: ITODO[] = await Todo.find()

        res
            .status(201)
            .json({ message: "Todo added", todo: newTodo, todos: allTodos})
    } catch (error) {
        throw error
    }
}

const updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            params: { id },
            body,
        } = req
        const updateTodo: ITODO | null = await Todo.findByIdAndUpdate(
            { _id: id },
            body
        )
        const allTodos: ITODO[] = await Todo.find()
        res.status(200).json({
            message: "Todo Updated",
            todo: updateTodo,
            todos: allTodos,
        })
    } catch (error) {
        throw error        
    }
}

const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedTodo: ITODO | null = await Todo.findByIdAndRemove(
            req.params.id
        )
        const allTodos: ITODO[] = await Todo.find()
        res.status(200).json({
            message: "Todo deleted",
            todo: deleteTodo,
            todos: allTodos,
        })
    } catch (error) {
        throw error
    }
}

export { getTodos, addTodo, updateTodo, deleteTodo }