import { prisma } from "../../configs";
import { authenticated, validateRole, schema } from "../../middlewares";
import { validateInput } from "../../utils";
import constant from "../../constant";
const { UserInputError } = require("apollo-server-express");
const { ADMIN, USER } = constant;
const UserQueries = {
    users: authenticated(
        validateRole([ADMIN, USER])((parent, args, context, info) => prisma.user.findMany())
    ),
    user: validateRole([ADMIN, USER])((parent, args, context, info) =>
        prisma.user.findUnique({ where: args })
    ),
};

const UserMutation = {
    createUser: authenticated(
        validateRole([ADMIN])(
            validateInput(schema.userSchema)((parent, args, context, info) =>
                prisma.user.create({ data: args })
            )
        )
    ),

    deleteUser: authenticated(
        validateRole([ADMIN, USER])(async (parent, args, context, info) => {
            const user = await prisma.user.findUnique({ where: args });
            if (!user) throw new UserInputError("id user is incorrect");
            await prisma.user.delete({ where: args });
            return {
                id: user.id,
                name: user.name,
                books: [],
            };
        })
    ),

    updateUser: authenticated(
        validateRole([ADMIN, USER])(
            validateInput(schema.userSchema)((parent, args, context, info) =>
                prisma.user.update({
                    where: { id: args.id },
                    data: { name: args.name },
                })
            )
        )
    ),
};

export { UserQueries, UserMutation };
