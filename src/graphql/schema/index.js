import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type Book {
        id: ID
        title: String
        authorId: Int
        name: String
    }

    type User {
        id: ID
        name: String
        books: [Book]
    }
    type Account {
        id: ID
        userName: String
        role: Int
        token: String
    }
    interface MutationResponse {
        status: String
        success: Boolean
        message: String
    }

    type RegisterMutationResponse implements MutationResponse {
        status: String
        success: Boolean
        message: String
        userName: String
    }

    type LoginMutationResponse implements MutationResponse {
        status: String
        success: Boolean
        message: String
        token: String
    }

    type Query {
        users: [User]
        user(id: Int!): User
        books: [Book]
        book(id: Int!): Book
        login(userName: String!, password: String!): MutationResponse
    }

    type Mutation {
        register(
            userName: String!
            password: String!
            role: Int!
        ): MutationResponse

        createUser(name: String): User
        deleteUser(id: Int!): User
        updateUser(id: Int!, name: String): User
        createBook(title: String!, authorId: Int!): Book
        deleteBook(id: Int!): Book
        updateBook(id: Int!, title: String, authorId: Int): Book
    }
`;
