import { asyncHandler } from "../../errors/asyncHandler.error.js";
import { ErrorHandler } from "../../errors/errorHandler.error.js";
import { emailTemplate } from "../../helper/helper.js";
import { Users } from "../../models/users.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.utils.js";
import { deleteFile } from "../../utils/fileHandling.utils.js";
import { loginWithJWT } from "../../utils/login.utility.js";
import { sendMail } from "../../utils/sendMail.utils.js";

export const register = asyncHandler(async (req, res, next) => {
    const {firstName, lastName, username, email, password} = req.body;
    const user = await Users.findOne({email});

    if(user) return next(new ErrorHandler("User already exists", 400));

    const profileImage = req.file.path;

    if(!profileImage) return next(new ErrorHandler("Please send profile image", 400));

    const {success, data} = await uploadOnCloudinary([profileImage]);
    
    if(!success) return next(new ErrorHandler(data, 400));
    
    const public_id = data[0].public_id;
    const url = data[0].url;
    const avatar = {public_id, url};
    const {success : deleteSuccess, data : deleteData} = await deleteFile([profileImage]);

    if(!deleteSuccess) return next(new ErrorHandler(deleteData, 400));

    console.log("Creating user...")
    await Users.create({firstName, lastName, username, email, password, avatar});

    res.status(201).json({success : true, message : "User registered successfully"});

})

export const login = asyncHandler(async (req, res, next) => {
    const {email, password,username} = req.body;

    const user = await Users.findOne({$or: [{email}, {username}]}).select("+password");

    if(!user) return next(new ErrorHandler("Invalid email or password", 400));

    if(! (await user.comparePassword(password))) return next(new ErrorHandler("Invalid email or password", 400));

    await loginWithJWT({user, res});
})

export const logout = asyncHandler(async (req, res,next) => {
    res.cookie("token", null, {expires : new Date(Date.now()), httpOnly: true, sameSite : "none"});
    res.clearCookie("token").status(200).json({success : true, message : "User logged out successfully"});
})

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const {email,username} = req.body;

    const user = await Users.findOne({$or: [{email}, {username}]}).select("+password");

    if(!user) return next(new ErrorHandler("Invalid email or username", 400));

    const resetToken = await user.generateResetPasswordToken();
    await user.save();

    const messageUrl = `${req.protocol}://${req.get('host')}/api/v2/reset-password/${resetToken}`
   

    try {
        await sendMail({email, subject : "Reset Your password for oscar print website.", reset_link : messageUrl, template : emailTemplate(messageUrl)});

        res.status(200).json({success : true, message : "Email sent successfully for reset password !"});
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();
        console.log(error)
        return next(new ErrorHandler(error, 500));
    }



})

export const resetPassword = asyncHandler(async (req, res, next) => {
    const {password, confirmPassword} = req.body;

    const resetPasswordToken = req.params.token;

    if(password !== confirmPassword) return next(new ErrorHandler("Password and confirm password does not match", 400));

    const resetToken = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");

    const user = await Users.findOne({resetPasswordToken : resetToken, resetPasswordExpiry: {$gt : Date.now()}}).select("+password");

    if(!user) return next(new ErrorHandler("Token is invalid or has been expired", 400));

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    await loginWithJWT({user, res});
})