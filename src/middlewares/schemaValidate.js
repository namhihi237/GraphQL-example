import * as yup from "yup";

export default {
    registerSchema: yup.object().shape({
        userName: yup.string().trim().required().min(3, "userName must be more than 2 characters"),
        password: yup.string().trim().required(),
        role: yup.string(),
    }),

    loginSchema: yup.object().shape({
        userName: yup.string().trim().required().min(3, "userName must be more than 2 characters"),
        password: yup.string().trim().required(),
    }),

    userSchema: yup.object().shape({
        name: yup.string().trim().required(),
    }),

    bookSchema: yup.object().shape({
        title: yup.string().trim().required().min(3, "title must be more than 2 characters"),
        authorId: yup.number().required().min(1, "min authorId is 1"),
    }),
};
