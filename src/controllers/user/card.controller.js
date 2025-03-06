import mongoose from "mongoose";
import { asyncHandler } from "../../errors/asyncHandler.error.js";
import { Cards } from "../../models/card.model.js";
import { ErrorHandler } from "../../errors/errorHandler.error.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.utils.js";

export const createNewDesign = asyncHandler(async (req, res, next) => {
    const cardData = req.body;
    const image = req.file.path;
    if(!image) return next(new ErrorHandler("Please send image", 400));

    const {success, data} = await uploadOnCloudinary([image]);
    if(!success) return next(new ErrorHandler(data, 400));

    const public_id = data[0].public_id;
    const url = data[0].url;

    await Cards.create({...cardData, userId: req.user.id, image : {public_id, url}});

    res.status(200).json({
        success : true,
        message : "New card design created successfully !"
    })
})

export const updateCard = asyncHandler(async (req, res, next) => {
    const {image, jsonData} = req.body;

    const cardId = req.params.id;

    if(! mongoose.isValidObjectId(cardId)) return next(new ErrorHandler("Please send valid card id for updating !",404))

    await Cards.updateOne({_id : cardId}, {$set : {image, JSONCard : jsonData}});

    res.status(200).json({
        success : true,
        message : "Card updated successfully !"
    })
})

export const deleteCard = asyncHandler(async (req, res, next) => {
    const cardId = req.params.id;
    if(! mongoose.isValidObjectId(cardId)){
        return next(new ErrorHandler("Please send valid card id for deleting !",404))
    }

    await Cards.deleteOne({_id : cardId});

    res.status(200).json({
        success : true,
        message : "Your card deleted successfully !"
    })
})

export const getMyCard = asyncHandler(async (req, res, next) => {
    const {limit = 20, page = 1} = req.query;
    const skip = limit * (page - 1);

    const cards = await Cards.find({userId : req.user.id}).skip(skip).limit(limit);

    res.status(200).json({
        success : true,
        message : "Cards fetched successfully !",
        data : cards
    })
})