import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import http from 'http';

import * as db from './database.js';

import dotenv from 'dotenv';
dotenv.config();

import { resolveFixtures, resolveFixtureById } from './resolvers/fixtures.js';

const typeDefs = readFileSync('./src/typeDefs/schema.gql').toString('utf-8');

const resolvers = {
    Query: {
        fixtures: resolveFixtures,
        fixtureById: resolveFixtureById,
    },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
const httpServer = http.createServer(app);

app.get('/', (req, res) => {
    res.send({ available: true });
});
// app.use(...)
app.use(bodyParser.json());

server.applyMiddleware({ app });
db.connect();
httpServer.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
