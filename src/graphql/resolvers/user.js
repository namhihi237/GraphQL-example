import { prisma } from "../../configs";
import { authenticated, validateRole } from "../../middlewares";
const UserQueries = {
    users: authenticated(
        validateRole([0, 1])((parent, args, context, info) =>
            prisma.user.findMany()
        )
    ),
    user: validateRole([0, 1])((parent, args, context, info) =>
        prisma.user.findUnique({ where: args })
    ),
};

const UserMutation = {
    createUser: authenticated(
        validateRole([0])((parent, args, context, info) =>
            prisma.user.create({ data: args })
        )
    ),

    deleteUser: authenticated(
        validateRole([0])((parent, args, context, info) =>
            prisma.user.delete({ where: args })
        )
    ),

    updateUser: authenticated(
        validateRole([0])((parent, args, context, info) =>
            prisma.user.update({
                where: { id: args.id },
                data: { name: args.name },
            })
        )
    ),
};

export { UserQueries, UserMutation };
