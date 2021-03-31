import ApolloClient from "apollo-boost";
import fetch from "node-fetch";

export const client = new ApolloClient({
    fetch,
    uri: "http://localhost/graph",
});
