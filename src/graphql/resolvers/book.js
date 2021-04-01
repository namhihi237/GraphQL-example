import { prisma } from "../../configs";
import { authenticated, validateRole, schema } from "../../middlewares";
import { validateInput } from "../../utils";
import constant from "../../constant";
const { ADMIN, USER } = constant;
const { UserInputError } = require("apollo-server-express");
const BookQueries = {
    books: authenticated(
        validateRole([ADMIN, USER])((parent, args, context, info) =>
            prisma.$queryRaw(
                `SELECT book.id,book.title,book.authorId,user.name 
             FROM book 
             INNER JOIN user 
             ON book.authorId = user.id`
            )
        )
    ),

    book: authenticated(
        validateRole([ADMIN, USER])(async (parent, args, context, info) => {
            const result = await prisma.$queryRaw(
                `SELECT book.id,book.title,book.authorId,user.name 
             FROM book 
             INNER JOIN user 
             ON book.authorId = user.id 
             WHERE book.id = ${args.id}`
            );
            return result[0];
        })
    ),
};

const BookMutation = {
    createBook: authenticated(
        validateRole([ADMIN])(
            validateInput(schema.bookSchema)((parent, args, context, info) =>
                prisma.book.create({ data: args })
            )
        )
    ),

    deleteBook: authenticated(
        validateRole([ADMIN])(async (parent, args, context, info) => {
            const book = await prisma.book.findUnique({ where: args });
            if (!book) throw new UserInputError("id book is incorrect");
            await prisma.book.delete({ where: args });
            return {
                id: book.id,
                title: book.title,
            };
        })
    ),

    updateBook: authenticated(
        validateRole([ADMIN, USER])(
            validateInput(schema.bookSchema)((parent, args, context, info) => {
                const { id, title, authorId } = args;
                return prisma.book.update({
                    where: { id },
                    data: { title, authorId },
                });
            })
        )
    ),
};

export { BookQueries, BookMutation };
