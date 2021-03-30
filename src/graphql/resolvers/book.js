import { prisma } from "../../configs";
import { authenticated, validateRole } from "../../middlewares";
import constant from "../../constant";
const { ADMIN, USER } = constant;
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
        validateRole([ADMIN])((parent, args, context, info) =>
            prisma.book.create({ data: args })
        )
    ),

    deleteBook: authenticated(
        validateRole([0])((parent, args, context, info) =>
            prisma.book.delete({ where: args })
        )
    ),

    updateBook: authenticated(
        validateRole([ADMIN, USER])((parent, args, context, info) => {
            const { id, title, authorId } = args;
            return prisma.book.update({
                where: { id },
                data: { title, authorId },
            });
        })
    ),
};

export { BookQueries, BookMutation };
