import jwt from "jsonwebtoken";

const generateToken = (id: string, email: string): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

export default generateToken;
