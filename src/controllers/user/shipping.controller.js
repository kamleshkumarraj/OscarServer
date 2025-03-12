import { asyncHandler } from "../../errors/asynHandler.js";
import { shippingAddress } from "../../models/shippingAddress.model.js";

// code for add address in address models.
export const addAddress = asyncHandler(async (req , res , next) => {
    const {address , city , district , subDistrict , state , pinCode , country , mobileNumber} = req.body;

    await shippingAddress.create({userId : req.user.id , mobileNumber , address , city , district , subDistrict , state , pinCode , country })
    
    res.status(200).json({
        success : true,
        message : "Address added successfully"
    })

})

// code for delete address from models.
export const deleteAddress = asyncHandler(async (req , res , next) => {
    const {addrId} = req.params 
    const addr = await shippingAddress.findById(addrId)
    if(!addr) return next(new ErrorHandler("Couldn't find shipping address" , 404))

    await shippingAddress.findByIdAndDelete(addrId)
    res.status(200).json({
        success : true,
        message : "Address deleted successfully"
    })
})

// code for get all address
export const getMyAddress = asyncHandler(async (req , res , next) => {
    const myAddr = await shippingAddress.find({userId : req.user.id})
    
    res.status(200).json({
        success : true,
        message : "You get all shipping address successfully",
        data : myAddr
    })
})


//code for updating address.
export const updateAddress = asyncHandler(async (req , res , next) => {
    const addr = req.body 
    const {addrId} = req.params 
    const address = await shippingAddress.findById(addrId)
    if(!address) return next(new ErrorHandler("Address not found !",404))
    await shippingAddress.findByIdAndUpdate(addrId , addr , {runValidators : true , new : true , useFindAndModify : false})

    res.status(200).json({
        success : true,
        message : "Address updated successfully"
    })
})

// code for update selected address.
export const updateSelectedAddressStatus = asyncHandler(async (req , res , next) => {
    const {prev , curr} = req.params;
    if(!prev || !curr) return next(new ErrorHandler("Please provide both prev and next address id" , 404))

    await shippingAddress.findByIdAndUpdate(prev , {selectStatus : false} , {runValidators : true})

    await shippingAddress.findByIdAndUpdate(curr , {selectStatus : true})

    res.status(200).json({
        success : true,
        message : "Selected address status updated successfully"
    })
})