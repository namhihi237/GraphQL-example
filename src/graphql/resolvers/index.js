import { UserMutation, UserQueries } from "./user";
import { BookMutation, BookQueries } from "./book";
import { AccountMutation } from "./account";
import { __Type } from "graphql";

const resolvers = {
    MutationResponse: {
        __resolveType(mutaionResponse, context, info) {
            if (mutaionResponse.token) {
                return "LoginMutationResponse";
            }
            if (mutaionResponse.userName) {
                return "RegisterMutationResponse";
            }
            return null;
        },
    },

    Query: {
        ...UserQueries,
        ...BookQueries,
    },

    Mutation: {
        ...UserMutation,
        ...BookMutation,
        ...AccountMutation,
    },
};
export default resolvers;
