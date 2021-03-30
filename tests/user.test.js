import { ApolloClient, gql } from "apollo-boost";
import { prisma } from "../src/configs";
import { client } from "./utils/getClient";
import "cross-fetch/polyfill";

beforeAll(async () => {
    await prisma.account.deleteMany();
});
describe("Tests the register Mutation", () => {
    it("should not sign up an account with password is number", async () => {
        const createUser = gql`
            mutation {
                register(userName: "xxxxx", password: 123456, role: ADMIN) {
                    status
                    message
                    success
                    ... on RegisterMutationResponse {
                        userName
                    }
                }
            }
        `;
        const response = await client.mutate({ mutation: createUser });
        const status = response.error.errors.message;
        expect(status).toBe(
            "String cannot represent a non string value: 123456"
        );
    });
    it("should sign up account", async () => {
        const createUser = gql`
            mutation {
                register(userName: "user343", password: "123456", role: ADMIN) {
                    status
                    message
                    success
                    ... on RegisterMutationResponse {
                        userName
                    }
                }
            }
        `;
        const response = await client.mutate({ mutation: createUser });
        const status = response.data.register.status;
        expect(status).toBe("200");
    });
});
