export const authenticated = (next) => (parent, args, context, info) => {
    if (!context.currentUser) {
        throw new Error(`Unauthenticated!`);
    }

    return next(parent, args, context, info);
};
