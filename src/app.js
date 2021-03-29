import { ApolloServer } from "apollo-server-express";

import { typeDefs } from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { verifyToken } from "./utils/token";
import { envVariable } from "./configs";
const express = require("express");

const path = "/graph";

const server = new ApolloServer({
    typeDefs,
    resolvers,
    debug: envVariable.NODE_ENV === "test" ? true : false,

    context: ({ req }) => {
        let token = null;
        let currentUser = null;
        token = req.headers.authorization
            ? req.headers.authorization.split(" ")[1]
            : null;
        try {
            currentUser = verifyToken(token);
        } catch (error) {
            console.warn(`Unable to authenticate using auth token: ${token}`);
        }

        return { currentUser };
    },
});

const app = express();

server.applyMiddleware({ app, path });

app.listen({ port: process.env.PORT }, () =>
    console.log(`🚀 Server ready ${server.graphqlPath}`)
);
