import { prisma } from "../../configs";
import { authenticated, validateRole } from "../../middlewares";
const BookQueries = {
    books: validateRole([0, 1])((parent, args, context, info) =>
        prisma.$queryRaw(
            `SELECT book.id,book.title,book.authorId,user.name 
             FROM book 
             INNER JOIN user 
             ON book.authorId = user.id`
        )
    ),
    book: validateRole([0, 1])(async (parent, args, context, info) => {
        const result = await prisma.$queryRaw(
            `SELECT book.id,book.title,book.authorId,user.name 
             FROM book 
             INNER JOIN user 
             ON book.authorId = user.id 
             WHERE book.id = ${args.id}`
        );
        return result[0];
    }),
};

const BookMutation = {
    createBook: validateRole([0])((parent, args, context, info) =>
        prisma.book.create({ data: args })
    ),

    deleteBook: validateRole([0])((parent, args, context, info) =>
        prisma.book.delete({ where: args })
    ),

    updateBook: validateRole([0, 1])((parent, args, context, info) => {
        const { id, title, authorId } = args;
        return prisma.book.update({
            where: { id },
            data: { title, authorId },
        });
    }),
};

export { BookQueries, BookMutation };
