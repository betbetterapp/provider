const { ApolloServer, gql } = require('apollo-server');
import { readFileSync } from 'fs';
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

const typeDefs = readFileSync('./src/typeDefs/schema.gql').toString('utf-8');

const resolvers = {
    Query: {
        sentiment: (_parent: any, args: any) => sentiment.analyze(args.phrase),
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }: { url: string }) => {
    console.log(`🚀 Server ready at ${url}`);
});
