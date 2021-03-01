import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import * as db from './database.js';

import { resolveFixtures, resolveFixtureById } from './resolvers/fixtures.js';

const typeDefs = readFileSync('./src/typeDefs/schema.gql').toString('utf-8');

const resolvers = {
    Query: {
        fixtures: resolveFixtures,
        fixtureById: resolveFixtureById,
    },
};

const server = new ApolloServer({ typeDefs, resolvers });
db.connect();
server.listen(process.env.port || 4000).then(({ url }: { url: string }) => {
    console.log(`🚀 Server ready at ${url}`);
});
