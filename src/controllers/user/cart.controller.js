import { asyncHandler } from "../../errors/asyncHandler.error.js";
import { Carts } from "../../models/cart.model";

export const createCart = asyncHandler(async (req, res, next) => {
    const {cardId, quantity, price} = req.body;

    if(!mongoose.isValidObjectId(cardId)) return next(new ErrorHandler("Please send valid card id for creating cart !",404))

    await Carts.create({card : cardId, quantity, price});

    res.status(201).json({
        success : true,
        message : "Card is added in cart list successfully."
    })
})

