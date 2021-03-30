import { prisma } from "../../configs";
import { authenticated, validateRole } from "../../middlewares";
import constant from "../../constant";
const { ADMIN, USER } = constant;
const UserQueries = {
    users: authenticated(
        validateRole([ADMIN, USER])((parent, args, context, info) =>
            prisma.user.findMany()
        )
    ),
    user: validateRole([ADMIN, USER])((parent, args, context, info) =>
        prisma.user.findUnique({ where: args })
    ),
};

const UserMutation = {
    createUser: authenticated(
        validateRole([ADMIN])((parent, args, context, info) =>
            prisma.user.create({ data: args })
        )
    ),

    deleteUser: authenticated(
        validateRole([ADMIN, USER])((parent, args, context, info) =>
            prisma.user.delete({ where: args })
        )
    ),

    updateUser: authenticated(
        validateRole([ADMIN, USER])((parent, args, context, info) =>
            prisma.user.update({
                where: { id: args.id },
                data: { name: args.name },
            })
        )
    ),
};

export { UserQueries, UserMutation };
