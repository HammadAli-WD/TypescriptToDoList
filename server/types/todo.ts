import { Document } from 'mongoose'
export interface ITODO extends Document {
    name: string
    description: string
    status: boolean
}