import { prisma } from "../../configs";
import { deToken } from "../../utils";
import * as yup from "yup";

const AccountQueries = {
    login: async (parent, args, context, info) => {
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
    },
};

const AccountMutation = {
    // register: {
    //     validationSchema: yup.object({
    //         userName: yup
    //             .string()
    //             .trim()
    //             .required()
    //             .min(3, "userName is too short"),
    //         password: yup.string().trim().required(),
    //     }),
    //     resolver: async (parent, args, context, info) => {
    //         await prisma.account.create({ data: args });
    //         return {
    //             status: "200",
    //             success: true,
    //             message: "Register account successfully",
    //             userName: args.userName,
    //         };
    //     },
    // },
    register: async (parent, args, context, info) => {
        await prisma.account.create({ data: args });
        return {
            status: "200",
            success: true,
            message: "Register account successfully",
            userName: args.userName,
        };
    },
};

export { AccountQueries, AccountMutation };
