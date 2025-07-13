import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { context } from './libs/context.js'
import { typeDefs } from './graphQL/types/index.js'
import { createYoga, createSchema } from 'graphql-yoga'
import { resolvers } from './graphQL/resolvers/index.js'
import { mongoDBconnect } from './mongoDB/connection/mongodb.js'


// load enviroment variables
dotenv.config()

// start the server
const app = express()

// set middelware
app.use(cors({}))

const yoga = createYoga({
    schema: createSchema({
        typeDefs,
        resolvers
    }),
    context
})

// graphql endpoint
app.use('/graphql', yoga)

mongoDBconnect(app)