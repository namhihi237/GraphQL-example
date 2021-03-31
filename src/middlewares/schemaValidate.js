import * as yup from "yup";
export default {
    registerSchema: yup.object().shape({
        userName: yup
            .string()
            .trim()
            .required()
            .min(3, "userName is too short, min 3 charactor"),
        password: yup.string().trim().required(),
        role: yup.string(),
    }),

    loginSchema: yup.object().shape({
        userName: yup
            .string()
            .trim()
            .required()
            .min(3, "userName is too short, min 3 charactor"),
        password: yup.string().trim().required(),
    }),

    bookSchema: yup.object().shape({
        title: yup.string().trim().required().min(3, "title is too short"),
        authorId: yup.number().required().max(3, "author id max la 3"),
    }),
};
