import jwt_decode from "jwt-decode";

export const isAuthenticatedFromToken = (token: string) => {
    let decoded: any = jwt_decode(token);

    return new Date(decoded.exp * 1000).getTime() > new Date().getTime();
};