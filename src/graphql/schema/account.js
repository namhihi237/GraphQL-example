import { gql } from "apollo-server-express";

export default gql`
    enum Role {
        ADMIN
        USER
    }
    type Account {
        id: ID
        userName: String
        role: Role
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
        login(userName: String!, password: String!): MutationResponse
    }
    type Mutation {
        register(
            userName: String!
            password: String!
            role: Role!
        ): MutationResponse
    }
`;
