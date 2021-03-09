import express from 'express';
import { execute, subscribe } from 'graphql';
import { ApolloServer, PubSub, makeExecutableSchema } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import http from 'http';
import axios from 'axios';

import mongoose from 'mongoose';
import * as db from './database.js';

import dotenv from 'dotenv';
dotenv.config();

import { resolveFixtures, resolveFixtureById } from './resolvers/fixtures.js';
import { parseFixtures } from './resolvers/fixtures.js';
import { Fixture } from './models/FixtureModel.js';

const typeDefs = readFileSync('./src/typeDefs/schema.gql').toString('utf-8');

const pubsub = new PubSub();
const FIXTURE_UPDATE = 'FIXTURE_UPDATE';

const resolvers = {
    Subscription: {
        fixtureUpdate: {
            subscribe: () => {
                return pubsub.asyncIterator(FIXTURE_UPDATE);
            },
        },
    },
    Query: {
        fixtures: resolveFixtures,
        fixtureById: resolveFixtureById,
    },
};

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

app.use(async function (req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        return next();
    }
    const response = await axios.get('http://localhost:5441/validate', {
        withCredentials: true,
        headers: {
            Cookie: `connect.sid=${req.cookies['connect.sid']}`,
        },
    });
    const data = response.data;
    console.log(response.data);
    if (data.success) {
        next();
    } else {
        res.send({ success: false, message: 'Authentication failed' });
    }
});
app.get('/', (req, res) => {
    res.send({ available: true });
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema: schema });
apolloServer.applyMiddleware({ app });

db.connect().then(() => {
    const client = mongoose.connection.getClient();
    const fixtureChangeStream = client.db('betbetterDB').collection('fixtures').watch();
    fixtureChangeStream.on('change', (next) => {
        console.log('New or updated fixture:', next);
    });

    const liveFixtureChangeStream = client.db('betbetterDB').collection('live').watch();
    liveFixtureChangeStream.on('change', async (next: any) => {
        console.log('New or updated live fixture');
        console.log(next?.fullDocument?._id);
        if (next.fullDocument) {
            console.log('A new match has been added into the live collection');
            const fixture = parseFixtures([next.fullDocument]);
            pubsub.publish(FIXTURE_UPDATE, { fixtureUpdate: fixture[0] });
        } else {
            console.log('Updated a fixture.');
            console.log('ID:', next.documentKey._id);

            const fixture: Fixture | null = await db.getFixtureByDocumentId(next.documentKey._id, true);
            console.log(fixture, 'GOT VALID FIXTURE');
            if (fixture) {
                console.log('Publishing fixture...');
                const parsed = parseFixtures([fixture]);
                pubsub.publish(FIXTURE_UPDATE, { fixtureUpdate: parsed[0] });
            }
        }
    });
});

const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    new SubscriptionServer(
        {
            execute,
            subscribe,
            schema: schema,
        },
        {
            server: httpServer,
            path: '/graphql',
        }
    );
});
