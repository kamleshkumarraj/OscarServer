import mongoose from "mongoose";
import { asyncHandler } from "../../errors/asyncHandler.error.js";
import { Cards } from "../../models/card.model.js";
import { ErrorHandler } from "../../errors/errorHandler.error.js";

export const createNewDesign = asyncHandler(async (req, res, next) => {
    const cardData = req.body;
    await Cards.create({...cardData, userId: req.user.id});

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