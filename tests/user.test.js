import { gql } from "apollo-boost";
import { prisma } from "../src/configs";
import { getClient } from "./utils/getClient";
import "cross-fetch/polyfill";
let authenticatedClient;
const client = getClient();
beforeAll(async (done) => {
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    const createUser = gql`
        mutation {
            register(userName: "user343", password: "123456", role: ADMIN) {
                status
            }
        }
    `;
    const loginAccount = gql`
        mutation {
            login(userName: "user343", password: "123456") {
                status
                ... on LoginMutationResponse {
                    token
                }
            }
        }
    `;
    await client.mutate({ mutation: createUser });
    const response = await client.mutate({ mutation: loginAccount });
    const token = response.data.login.token;
    authenticatedClient = getClient(token);
    done();
});
let idUser;
describe("Tests the create user Mutation", () => {
    it("should not create a user with name is empty", async () => {
        const createUser = gql`
            mutation {
                createUser(name: "") {
                    id
                }
            }
        `;
        await expect(
            authenticatedClient.mutate({
                mutation: createUser,
            })
        ).rejects.toThrowError("GraphQL error: name is a required field");
    });

    it("should create a user", async () => {
        const createUser = gql`
            mutation {
                createUser(name: "user23799") {
                    id
                }
            }
        `;
        const response = await authenticatedClient.mutate({ mutation: createUser });
        idUser = response.data.createUser.id;
        const user = await prisma.user.findUnique({ where: { id: parseInt(idUser) } });
        expect(parseInt(idUser)).toBe(user.id);
    });
});

describe("Tests show user Query", () => {
    it("should show all users", async () => {
        const users = gql`
            query {
                users {
                    id
                }
            }
        `;
        const response = await authenticatedClient.query({ query: users });
        let len = response.data.users.length;
        expect(len).toBeGreaterThan(0);
    });

    it(`should show a users id = ${idUser}  `, async () => {
        const user = gql`
            query {
                user(id : ${idUser}) {
                    id
                }
            }
        `;
        const response = await authenticatedClient.query({ query: user });
        let id = response.data.user.id;
        expect(id).toBe(`${idUser}`);
    });
});

describe("Tests update user Mutation", () => {
    it("should not update a user with name is empty", async () => {
        const updateUser = gql`
            mutation {
                updateUser(id: ${idUser}, name: " ") {
                    id
                }
            }
        `;
        await expect(
            authenticatedClient.mutate({
                mutation: updateUser,
            })
        ).rejects.toThrowError("GraphQL error: name is a required field");
    });

    it("should update a user", async () => {
        const updateUser = gql`
            mutation {
                updateUser(id: ${idUser}, name: "user23799") {
                    name
                    id
                }
            }
        `;
        const response = await authenticatedClient.mutate({ mutation: updateUser });
        const { id, name } = response.data.updateUser;
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        expect(name).toBe(user.name);
    });
});

describe("Tests delete user Mutation", () => {
    it("should not delete a user with id incorrect", async () => {
        const deleteUser = gql`
            mutation {
                deleteUser(id: ${idUser + 1}) {
                    id
                }
            }
        `;
        await expect(
            authenticatedClient.mutate({
                mutation: deleteUser,
            })
        ).rejects.toThrowError("GraphQL error: id user is incorrect");
    });

    it("should delete a user", async () => {
        const deleteUser = gql`
            mutation {
                deleteUser(id: ${idUser}) {
                    id
                }
            }
        `;
        const response = await authenticatedClient.mutate({ mutation: deleteUser });
        const { id } = response.data.deleteUser;
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        expect(user).toBe(null);
    });
});
