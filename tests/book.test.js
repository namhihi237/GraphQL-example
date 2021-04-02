import { gql } from "apollo-boost";
import { prisma } from "../src/configs";
import { getClient } from "./utils/getClient";
import "cross-fetch/polyfill";
let authenticatedClient;
let idUser;
let bookId;
const client = getClient();
beforeAll(async () => {
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    const createAccount = gql`
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
    await client.mutate({ mutation: createAccount });
    const response = await client.mutate({ mutation: loginAccount });
    const token = response.data.login.token;
    authenticatedClient = getClient(token);
    const createUser = gql`
        mutation {
            createUser(name: "user23799") {
                id
            }
        }
    `;
    const response1 = await authenticatedClient.mutate({ mutation: createUser });
    idUser = response1.data.createUser.id;
});

describe("Tests the create book Mutation", () => {
    it("should not create a book with title less than 3 charactor", async () => {
        const createBook = gql`
            mutation {
                createBook(title: "ba", authorId : ${idUser}) {
                    id
                }
            }
        `;
        await expect(
            authenticatedClient.mutate({
                mutation: createBook,
            })
        ).rejects.toThrowError("GraphQL error: title must be more than 2 characters");
    });

    it("should create a user", async () => {
        const createBook = gql`
            mutation {
                createBook(title: "mua hoa tan", authorId : ${idUser}) {
                    id
                }
            }
        `;
        const response = await authenticatedClient.mutate({ mutation: createBook });
        bookId = response.data.createBook.id;
        const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
        expect(parseInt(bookId)).toBe(book.id);
    });
});

describe("Tests get books Mutation", () => {
    it("should get all books", async () => {
        const getBooks = gql`
            query {
                books {
                    id
                }
            }
        `;
        const response = await authenticatedClient.query({ query: getBooks });
        let book = response.data.books;
        expect(book.length).toBe(1);
    });

    it(`should get book id = ${bookId}`, async () => {
        const getBook = gql`
            query {
                book(id : ${bookId}) {
                    id
                }
            }
        `;
        const response = await authenticatedClient.query({ query: getBook });
        let id = response.data.book.id;
        expect(id).toBe(bookId);
    });
});

describe("Tests update book Mutation", () => {
    it("should not update a book with title less than 3 charactor", async () => {
        const updateBook = gql`
            mutation {
                updateBook(title: "c" , id : ${bookId} , authorId : ${idUser}) {
                    id
                    title
                }
            }
        `;
        await expect(
            authenticatedClient.mutate({
                mutation: updateBook,
            })
        ).rejects.toThrowError("GraphQL error: title must be more than 2 characters");
    });

    it("should update a book ", async () => {
        const updateBook = gql`
            mutation {
                updateBook(title: "con ca con", id : ${bookId}, authorId : ${idUser}) {
                    id
                }
            }
        `;
        await authenticatedClient.mutate({ mutation: updateBook });
        const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
        expect(book.title).toBe("con ca con");
    });
});

describe("Tests delete book Mutation", () => {
    it("should not delete a book id incorrect", async () => {
        const deleteBook = gql`
            mutation {
                deleteBook( id : ${bookId + 1} ) {
                    id
                }
            }
        `;
        await expect(
            authenticatedClient.mutate({
                mutation: deleteBook,
            })
        ).rejects.toThrowError("GraphQL error: id book is incorrect");
    });

    it("should delete a book ", async () => {
        const deleteBook = gql`
            mutation {
                deleteBook( id : ${bookId} ) {
                    id
                }
            }
        `;
        await authenticatedClient.mutate({ mutation: deleteBook });
        const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
        expect(book).toBe(null);
    });
});
afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
});
