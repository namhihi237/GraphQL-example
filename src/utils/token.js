import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const deToken = (data) => {
    return jwt.sign(data, JWT_SECRET);
};

export const verifyToken = (token) => {
    try {
        if (token) {
            return jwt.verify(token, JWT_SECRET);
        }
        return null;
    } catch (error) {
        return null;
    }
};
