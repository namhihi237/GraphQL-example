import { ApolloServer, makeExecutableSchema } from "apollo-server-express";

import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { verifyToken } from "./utils/token";
import { envVariable } from "./configs";
import { yupValidation } from "./middlewares";
import { applyMiddleware } from "graphql-middleware";
const express = require("express");

const path = "/graph";

// const logInput = async (resolve, root, args, context, info) => {
//     console.log(`1. logInput: ${JSON.stringify(args)}`);
//     const result = await resolve(root, args, context, info);
//     console.log(`5. logInput`);
//     return result;
// };
// const logResult = async (resolve, root, args, context, info) => {
//     console.log(`2. logResult`);
//     const result = await resolve(root, args, context, info);
//     console.log(`4. logResult: ${JSON.stringify(result)}`);
//     return result;
// };
// const middlewares = [logInput, logResult];

// const schema = makeExecutableSchema({ typeDefs, resolvers });
// const schemaWithMiddleware = applyMiddleware(schema, loggingMiddleware);
const server = new ApolloServer({
    // schema: schemaWithMiddleware,
    typeDefs,
    resolvers,
    // middlewares,
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
