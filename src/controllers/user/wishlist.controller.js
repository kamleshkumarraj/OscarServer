import mongoose from "mongoose";
import { asyncHandler } from "../../errors/asyncHandler.error.js";
import { Wishlists } from "../../models/wishlist.model";

export const createWishlist = asyncHandler(async (req, res, next) => {
  const { cardId } = req.body;

  if (!mongoose.isValidObjectId(cardId))
    return next(
      new ErrorHandler("Please send valid card id for creating wishlist !", 404)
    );

  await Wishlists.create({ card: cardId });

  res.status(201).json({
    success: true,
    message: "Card is added in wishlist successfully.",
  });
});

export const removeWishlistItem = asyncHandler(async (req, res, next) => {
  const wishlistId = req.params.id;
  if (!mongoose.isValidObjectId(wishlistId))
    return next(
      new ErrorHandler("Please send valid wishlist id for removing item !", 404)
    );

  await Wishlists.deleteOne({ _id: wishlistId}); //! delete card from wishlist

  res.status(200).json({
    success: true,
    message: "Remove design from wishlist successfully.",
  });
});

export const getMyWishlist = asyncHandler(async (req, res, next) => {
  const wishlistId = req.params.id;
  const {limit=20, page=1} = req.query;
  const skip = limit * (page - 1);
  if (!mongoose.isValidObjectId(cartId))
    return next(
      new ErrorHandler("Please send valid wishlist id for getting wishlist !", 404)
    );

  const wishlistItems = await Wishlists.aggregate([
    {
      $match: {
        _id: wishlistId,
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
    message: "Wishlist fetched successfully.",
    data: wishlistItems,
  })
});