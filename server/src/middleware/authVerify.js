import jwt from "jsonwebtoken";
import {promisify} from "util";
import createHttpError from "http-errors";
import env from "../utils/validateEnv.js";

const jwtVerify = promisify(jwt.verify);

export const verifyToken =
  (roles = []) =>
  async (req, res, next) => {
    if (!Array.isArray(roles)) roles = [roles];
    const { authorization: token } = req.headers;
    //passed token is we dont have a valid user
    if (!token) return next(createHttpError(401, "No Token found"));
    if (!token.startsWith("Bearer"))
      return next(createHttpError(401, "Token format is invalid"));
    const tokenString = token.split(" ")[1];
    try {
      const decodedToken = await jwtVerify(tokenString, env.JWT_ACCESS_TOKEN);
      if (!decodedToken.role) {
        return next(createHttpError(403, "Error: Role missing"));
      }
      //includes method
      if (!roles.includes(decodedToken.role)) {
        return next(
          createHttpError(401, "User not authorized for this request")
        );
      }
      req.user = decodedToken;
      //the next takes data to where it ought to be 
      next();
    } catch (error) {
      return next(
        createHttpError(403, "Broken or expired token, pls login to gain access")
      );
    }
  };

  export const Roles = {
    User: ["user"],
    Admin: ["admin"],
    All: ["user", "admin"],
  };