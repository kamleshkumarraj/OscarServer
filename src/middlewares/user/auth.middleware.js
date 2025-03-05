import jwt from 'jsonwebtoken';
import { asyncHandler } from "../../errors/asyncHandler.error.js";
import { ErrorHandler } from "../../errors/errorHandler.error.js";
import { Users } from "../../models/users.model.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
    let {token} = req.cookies;
    token = token ? token : req?.headers?.authorization?.split(" ")[1];
    if(!token) return next(new ErrorHandler("Please login to access this resource !", 401));

    try {
        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
        const id = decodeToken.id;
        const user = await Users.findById(id);
        if(!user) return next(new ErrorHandler("Please login to access this resource !", 401));
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler("Please login to access this resource  or invalid token !", 401));
    }
})