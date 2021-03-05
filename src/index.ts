import express from 'express';
import { ApolloServer, PubSub } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import http from 'http';

import * as db from './database.js';

import dotenv from 'dotenv';
dotenv.config();

import { resolveFixtures, resolveFixtureById } from './resolvers/fixtures.js';
import mongoose from 'mongoose';

const typeDefs = readFileSync('./src/typeDefs/schema.gql').toString('utf-8');

const FIXTURE_UPDATE = 'FIXTURE_UPDATE';

const resolvers = {
    Subscription: {
        fixtureUpdate: {
            subscribe: (_: any, __: any, { pubsub }: { pubsub: PubSub }) => pubsub.asyncIterator(FIXTURE_UPDATE),
        },
    },
    Query: {
        fixtures: resolveFixtures,
        fixtureById: resolveFixtureById,
    },
};

const app = express();
const pubsub = new PubSub();
const server = new ApolloServer({ typeDefs, resolvers, context: ({ req, res }) => ({ req, res, pubsub }) });
const httpServer = http.createServer(app);

app.get('/', (req, res) => {
    res.send({ available: true });
});
// app.use(...)
app.use(bodyParser.json());

server.applyMiddleware({ app });
db.connect().then(() => {
    const client = mongoose.connection.getClient();
    const collection = client.db('betbetterDB').collection('fixtures');
    const changeStream = collection.watch();
    changeStream.on('change', (next) => {
        console.log('Next:', next);
    });
});

httpServer.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
