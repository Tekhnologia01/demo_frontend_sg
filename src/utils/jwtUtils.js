import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
    try {
        if (token) {
            const decoded = jwtDecode(token);
            return decoded
        }
    } catch (error) {
        console.error("Error decoding token:", error);
    }
    return null;
};