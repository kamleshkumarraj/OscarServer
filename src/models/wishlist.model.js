import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    card : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Card"
    },
    
}, {timestamps : true});

export const Wishlists = mongoose.model("Wishlist", wishlistSchema);