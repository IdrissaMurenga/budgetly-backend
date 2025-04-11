import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { context } from './libs/context.js';
import { typeDefs } from './graphQL/types/index.js';
import { createYoga, createSchema } from 'graphql-yoga';
import { resolvers } from './graphQL/resolvers/index.js';
import { mongoDBconnect } from './db/mongoConnection/mongodb.js';


// Load environment variables from .env file
dotenv.config();

// start server
const app = express();

//Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    methods: ['GET', 'POST', 'OPTIONS'],
}))

// GraphQL endpoint
const yoga = createYoga({
    schema: createSchema({
        typeDefs,
        resolvers
    }),
    context,
    // playground: process.env.NODE_ENV === 'development',
    // debug: process.env.NODE_ENV === 'development',
    // port: process.env.PORT || 4000,
})

app.use('/graphql', yoga)

mongoDBconnect(app)