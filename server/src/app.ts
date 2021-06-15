import express from "express"
const server = express()

import cors, { CorsOptions } from "cors"
import listEndpoints from "express-list-endpoints"
import { notFoundErrorHandler, forbiddenHandler, catchAllErrorHandler } from './errorHandler'

import mongoose from "mongoose"
mongoose.set('returnOriginal', false)
import todoRoutes from "./routes"

const whitelist = ["http://localhost:3000"]
const corsOptions: CorsOptions = {
  origin: function (requestOrigin: string | undefined, callback: (error: Error | null, success: boolean | undefined) => void) {
    if ( (requestOrigin && whitelist.indexOf(requestOrigin) !== -1) || !requestOrigin ) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"), undefined)
    }
  },
  credentials: true,
}
server.use(cors(corsOptions))
// server.use(cors())
server.use(express.json({limit:'9mb'}))

server.use("/", todoRoutes)
//console.table(listEndpoints(server))

// ******** ERROR MIDDLEWARES ************

server.use(forbiddenHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

const PORT: string | number = process.env.PORT || 4000
const uri: string = `mongodb://${process.env.MONGO_DB}/${process.env.MONGO_PROJECT}`
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,  
}).then( () => {
    server.listen(PORT, () => {
        console.log(listEndpoints(server))
        console.log("Running on port: " + PORT)
    })
}).catch((err) => console.log(err))



