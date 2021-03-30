const yupValidation = {
    async Mutation(resolve, parent, args, context, info) {
        const mutationField = info.schema.getMutationType().getFields()[
            info.fieldName
        ];
        const mutationValidationSchema = mutationField.validationSchema;

        if (mutationValidationSchema) {
            try {
                const values = await mutationValidationSchema.validate(args);
            } catch (error) {
                if (error instanceof yup.ValidationError) {
                    return {
                        error: error.message,
                    };
                } else {
                    throw error;
                }
            }
        }

        return resolve(parent, args, context, info);
    },
};

export { yupValidation };
