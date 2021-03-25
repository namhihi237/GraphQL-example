import { UserMutation, UserQueries } from "./user";
import { BookMutation, BookQueries } from "./book";
import { AccountMutation, AccountQueries } from "./account";

const resolvers = {
    Query: {
        ...UserQueries,
        ...BookQueries,
        ...AccountQueries,
    },

    Mutation: {
        ...UserMutation,
        ...BookMutation,
        ...AccountMutation,
    },
    Account: {
        id: (user) => user.id,
        userName: (user) => user.userName,
    },
};
export default resolvers;
