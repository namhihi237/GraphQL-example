import { ApolloClient, gql } from "apollo-boost";
import { prisma } from "../src/configs";
import { getClient } from "./utils/getClient";
import "cross-fetch/polyfill";
const client = getClient();
beforeAll(async () => {
    await prisma.account.deleteMany();
});

describe("Tests the register account Mutation", () => {
    it("should not sign up an account with username less than 3 charactor", async () => {
        const createUser = gql`
            mutation {
                register(userName: "u1", password: "123456", role: ADMIN) {
                    status
                }
            }
        `;
        await expect(
            client.mutate({
                mutation: createUser,
            })
        ).rejects.toThrowError("GraphQL error: userName must be more than 2 characters");
    });

    it("should sign up account", async () => {
        const createUser = gql`
            mutation {
                register(userName: "user2", password: "123456", role: ADMIN) {
                    status
                }
            }
        `;
        const response = await client.mutate({ mutation: createUser });
        const status = response.data.register.status;
        expect(status).toBe("200");
    });
});

describe("Tests the login account Mutation", () => {
    it("should not sign in an account with username less than 3 charactor", async () => {
        const loginAccount = gql`
            mutation {
                login(userName: "u1", password: "123456") {
                    status
                }
            }
        `;
        await expect(
            client.mutate({
                mutation: loginAccount,
            })
        ).rejects.toThrowError("GraphQL error: userName must be more than 2 characters");
    });

    it("should not sign in an account with username or password incorrect", async () => {
        const loginAccount = gql`
            mutation {
                login(userName: "user123", password: "1234567") {
                    status
                    ... on LoginMutationResponse {
                        token
                    }
                }
            }
        `;
        const response = await client.mutate({ mutation: loginAccount });
        const status = response.data.login.status;
        const token = response.data.login.token;
        expect(status).toBe("400");
        expect(token).toBe(" ");
    });

    it("should sign in account", async () => {
        const loginAccount = gql`
            mutation {
                login(userName: "user2", password: "123456") {
                    status
                    ... on LoginMutationResponse {
                        token
                    }
                }
            }
        `;
        const response = await client.mutate({ mutation: loginAccount });
        const status = response.data.login.status;
        const token = response.data.login.token;
        expect(status).toBe("200");
        expect(token).toBeTruthy();
    });
});
