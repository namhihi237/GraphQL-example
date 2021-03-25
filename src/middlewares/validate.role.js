export const validateRole = (role) => (next) => (root, args, context, info) => {
    if (!role.includes(context.currentUser.role)) {
        throw new Error(`Unauthorized!`);
    }

    return next(root, args, context, info);
};
