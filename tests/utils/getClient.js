import ApolloClient from "apollo-boost";
import fetch from "node-fetch";
export const getClient = (token) => {
    return new ApolloClient({
        fetch,
        uri: "http://localhost/graph",
        request: (operation) => {
            if (token) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        },
    });
};
