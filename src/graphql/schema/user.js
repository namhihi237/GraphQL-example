import { gql } from "apollo-server-express";

export default gql`
    type User {
        id: ID
        name: String
        books: [Book]
    }

    extend type Query {
        users: [User]
        user(id: Int!): User
    }

    extend type Mutation {
        createUser(name: String): User
        deleteUser(id: Int!): User
        updateUser(id: Int!, name: String): User
    }
`;
