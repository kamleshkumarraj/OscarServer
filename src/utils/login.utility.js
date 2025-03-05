export const loginWithJWT = async ({user,res}) => {
    const token = await user.generateJWTToken();
    const options = {
        expires : new Date(
            Date.now() + process.env.TOKEN_EXPIRY*60*60*1000
        ),
        httpOnly: true, 
        sameSite : "none",
    }
    res.cookie("token", token, options).status(200).json({success : true, message : "User logged in successfully", data : {user, token}});
}