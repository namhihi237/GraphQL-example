require("dotenv").config();

export const envVariable = {
    PORT: process.env.PORT || 80,
    DATABASE_URL: process.env.DATABASE_URL || "mysql://root:@localhost:3306/graphQL",
    JWT_SECRET: process.env.JWT_SECRET || "123456",
    NODE_ENV: process.env.NODE_ENV,
};
