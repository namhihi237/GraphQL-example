import { prisma } from "../../configs";
import { deToken, validateInput } from "../../utils";
import { schema } from "../../middlewares";
const AccountQueries = {
    login: validateInput(schema.loginSchema)(async (parent, args, context, info) => {
        const account = await prisma.account.findFirst({
            where: args,
            select: { userName: true, id: true, role: true },
        });
        if (account) {
            const token = deToken(account);
            return {
                status: "200",
                success: true,
                message: "Login account successfully",
                token,
            };
        }
        return {
            status: "400",
            success: false,
            message: "username or password is incorrect",
            token: " ",
        };
    }),
};

const AccountMutation = {
    register: validateInput(schema.registerSchema)(async (parent, args, context, info) => {
        try {
            await prisma.account.create({ data: args });
        } catch (error) {
            console.log(error);
        }
        return {
            status: "200",
            success: true,
            message: "Register account successfully",
            userName: args.userName,
        };
    }),
};

export { AccountQueries, AccountMutation };
