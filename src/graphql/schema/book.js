import { gql } from "apollo-server-express";

export default gql`
    type Book {
        id: ID
        title: String
        authorId: Int
        name: String
    }

    extend type Query {
        books: [Book]
        book(id: Int!): Book
    }

    extend type Mutation {
        createBook(title: String!, authorId: Int!): Book
        deleteBook(id: Int!): Book
        updateBook(id: Int!, title: String, authorId: Int): Book
    }
`;
