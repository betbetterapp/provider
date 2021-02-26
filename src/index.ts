const { ApolloServer } = require('apollo-server');
import { readFileSync } from 'fs';

const typeDefs = readFileSync('./src/typeDefs/schema.gql').toString('utf-8');

const resolvers = {
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }: { url: string }) => {
    console.log(`🚀 Server ready at ${url}`);
});
