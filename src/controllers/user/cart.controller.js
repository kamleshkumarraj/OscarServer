import mongoose from "mongoose";
import { asyncHandler } from "../../errors/asyncHandler.error.js";
import { Carts } from "../../models/cart.model.js";

export const createCart = asyncHandler(async (req, res, next) => {
  const { cardId, quantity, price } = req.body;

  if (!mongoose.isValidObjectId(cardId))
    return next(
      new ErrorHandler("Please send valid card id for creating cart !", 404)
    );

  await Carts.create({ card: cardId, quantity, price });

  res.status(201).json({
    success: true,
    message: "Card is added in cart list successfully.",
  });
});

export const removeItem = asyncHandler(async (req, res, next) => {
  const cardId = req.params.id;
  if (!mongoose.isValidObjectId(cardId))
    return next(
      new ErrorHandler("Please send valid card id for removing item !", 404)
    );

  await Carts.deleteOne({ card: cardId }); //! delete card from cart

  res.status(200).json({
    success: true,
    message: "Remove design from cart list successfully.",
  });
});

export const getMyCart = asyncHandler(async (req, res, next) => {
  const cartId = req.params.id;
  const {limit=20, page=1} = req.query;
  const skip = limit * (page - 1);
  if (!mongoose.isValidObjectId(cartId))
    return next(
      new ErrorHandler("Please send valid cart id for getting cart !", 404)
    );

  const cartList = await Carts.aggregate([
    {
      $match: {
        _id: cartId,
      },
    },
    {
      $lookup: {
        from: "cards",
        localField: "cards",
        foreignField: "_id",
        as: "cardList",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
              pipeline: [
                {
                  $project: {
                    firstName: 1,
                    lastName: 1,
                    avatar: 1,
                    email: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$user",
          },
          {
            $project: {
              _id: 0,
              image: 1,
              title: 1,
              JSONCard: 1,
              creator: "$user",
            },
          },
        ],
      },
    },
    {
      $unwind: "$cardList",
    },
    {
      $project: {
        _id: 1,
        cardData: "$cardList",
        quantity: 1,
        price: 1,
      },
    },
    {
        $skip : skip
    },
    {
        $limit : limit
    },
    {
        $sort : {
            createdAt : -1
        }
    }
  ]);

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully.",
    data: cartList,
  })
});

export const updateQty = asyncHandler(async (req,res,next) => {
    const {quantity} = req.body;
    const cartId = req.params.id;
    if(! mongoose.isValidObjectId(cartId)) return next(new ErrorHandler("Please send valid cart id for updating quantity !",404))
    await Carts.updateOne({_id : cartId}, {$set : {quantity}});

    res.status(200).json({
        success : true,
        message : "Quantity updated successfully !"
    })
})

export const increaseCartQty = asyncHandler(async (req, res, next) => {
    const cartId = req.params.id;
    if(! mongoose.isValidObjectId(cartId)) return next(new ErrorHandler("Please send valid cart id for increasing quantity !",404))
    await Carts.updateOne({_id : cartId}, {$inc : {quantity : 1}});

    res.status(200).json({
        success : true,
        message : "Quantity increased successfully !"
    })
});

export const decreaseCartQty = asyncHandler(async (req, res, next) => {
    const cartId = req.params.id;
    if(! mongoose.isValidObjectId(cartId)) return next(new ErrorHandler("Please send valid cart id for decreasing quantity !",404))
    await Carts.updateOne({_id : cartId}, {$inc : {quantity : -1}});

    res.status(200).json({
        success : true,
        message : "Quantity decreased successfully !"
    })
});

export const removeMultipleCart = asyncHandler(async (req, res, next) => {
  const cartId = req.body || [];

  if(cartId.length == 0) return next(new ErrorHandler("please send card id !",404))
  await Carts.deleteMany({ _id: { $in: cartId } });

  res.status(200).json({
    success: true,
    message: "Remove design from cart list successfully.",
  })
})
