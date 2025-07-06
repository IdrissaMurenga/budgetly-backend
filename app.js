import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { createYoga, createSchema } from 'graphql-yoga'
import { mongoDBconnect } from './mongoDB/connection/mongodb.js'
import { typeDefs } from './graphQL/types/index.js'
import { resolvers } from './graphQL/resolvers/index.js'
import { context } from './libs/context.js'


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