import { asyncHandler } from "../../errors/asyncHandler.error.js";
import { ErrorHandler } from "../../errors/errorHandler.error.js";
import { emailTemplate, emailTemplateForDeleteAccount } from "../../helper/helper.js";
import crypto from 'crypto';
import { Users } from "../../models/users.model.js";
import { sendMail } from "../../utils/sendMail.utils.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.utils.js";
import { profile } from "console";

//! controller for updating profile for a user.
export const updateProfile = asyncHandler(async (req, res, next) => {
    const data = req.body;
    const user = await Users.findByIdAndUpdate(req.user.id, data, {new: true, runValidators : true}).select("-userDeleteToken -userDeleteExpiry -resetPasswordToken -resetPasswordExpiry");

    res.status(200).json({
        success : true,
        message : "Profile updated successfully",
        data : user
    })
})

//! controller for getting profile for a user
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await Users.findById(req.user.id).select("-password -userDeleteToken -userDeleteExpiry -resetPasswordToken -resetPasswordExpiry");

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data : user
    })
})

//! controller for deleting profile for a user.
export const requestForDeleteProfile = asyncHandler(async (req, res, next) => {
    const user = await Users.findById(req.user.id);
    const deleteToken = user.generateUserDeleteToken();

    await user.save();

    const url = `${req.protocol}://${req.get('host')}/api/v2/reset-password/${deleteToken}`;

    try {
        await sendMail({email: user.email, subject : "Delete your account for oscar print website.", reset_link : url, template : emailTemplateForDeleteAccount(url)});

        res.status(200).json({
            success : true,
            message : "Email sent successfully for delete account !"
        })
    } catch (error) {
        console.log(error)
        user.userDeleteExpiry = undefined;
        user.userDeleteToken = undefined;
        await user.save();
        return next(new ErrorHandler(error, 500));
    }

})

//! controller for deleting profile for a user.
export const deleteProfile = asyncHandler(async (req, res, next) => {
    const token = req.params.token;
    console.log(token)
    const deleteAccountToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await Users.findOne({userDeleteToken : deleteAccountToken, userDeleteExpiry : {$gt : Date.now()}});

    if(!user) return next(new ErrorHandler("Token is invalid or has been expired", 400));

    user.userDeleteToken = undefined;
    user.userDeleteExpiry = undefined;

    // before deleting the profile we delete profile image from cloudinary.
    const profileImage = user.avatar.public_id;

    if(profileImage) {
        const {success, data} = await deleteOnCloudinary([profileImage]);
        if(!success) return next(new ErrorHandler(data, 400));
    }
    
    await user.deleteOne();

    res.cookie("token", null, {expires : new Date(Date.now()), httpOnly: true, sameSite : "none"}).status(200).json({
        success : true,
        message : "Account deleted successfully"
    })
})

//! controller for updating password for a user.
export const updatePassword = asyncHandler(async (req, res, next) => {
    const {oldPassword, newPassword, confirmPassword} = req.body;

    if(newPassword !== confirmPassword) return next(new ErrorHandler("Password and confirm password do not match", 400));

    console.log(req.user);

    const user = await Users.findById(req.user.id).select("+password");

    if(! await user.comparePassword(oldPassword)) return next(new ErrorHandler("Old password is incorrect", 400));

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success : true,
        message : "Password updated successfully"
    })

})

//! controller for updating profile image for a user.
export const updateProfileImage = asyncHandler(async (req, res, next) => {
    const profileImg = req.file.path;
    if(!profileImg) return next(new ErrorHandler("Profile image is required", 400));

    const {success, data} = await uploadOnCloudinary([profileImg]);
    if(!success) return next(new ErrorHandler(data, 400));

    const public_id = data[0].public_id;
    const url = data[0].url;
    const avatar = {public_id, url};

    // now we delete the old profile image from cloudinary.
    const user = await Users.findById(req?.user?.id);

    const oldAvatar = user.avatar.public_id;

    const {success : deleteSuccess, data : deleteData} = await deleteOnCloudinary([oldAvatar]);
    if(!deleteSuccess) return next(new ErrorHandler(deleteData, 400));

    const newUser = await Users.updateOne({_id : req?.user?.id}, {$set : {avatar}});
    res.status(200).json({
        success : true,
        message : "Profile image updated successfully",
        data : newUser
    })
 
})
