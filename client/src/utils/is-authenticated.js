import jwt_decode from "jwt-decode";

export const isAuthenticatedFromToken = (token) => {
    let decoded = jwt_decode(token);

    return new Date(decoded.exp * 1000).getTime() > new Date().getTime();
};