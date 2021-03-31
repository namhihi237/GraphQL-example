import * as yup from "yup";
const { UserInputError } = require("apollo-server-express");

export const validateInput = (inputSchema) => (next) => async (root, args, context, info) => {
    try {
        await inputSchema.validate(args);
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            throw new UserInputError(`${error.errors[0]}`);
        } else {
            throw new UserInputError(`Error`);
        }
    }
    return next(root, args, context, info);
};
