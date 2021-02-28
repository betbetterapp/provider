import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import * as db from './database.js';

const typeDefs = readFileSync('./src/typeDefs/schema.gql').toString('utf-8');

const resolvers = {
    Query: {},
};

const server = new ApolloServer({ typeDefs, resolvers });
db.connect()
    .then((res) => {
        if (!res) {
            console.log('Connection to db failed.');
            return;
        }
        console.log('Database res:', res);
    })
    .catch((err) => {
        console.log('Connection to db failed.');
        console.log('Database error:', err);
    });

server.listen().then(({ url }: { url: string }) => {
    console.log(`🚀 Server ready at ${url}`);
});
