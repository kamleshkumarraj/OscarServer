import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    card : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Card"
    },
    price : {
        type : Number,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    cardDetails : {
        type : Object,
        required : true
    }
}, {timestamps : true});

export const Carts = mongoose.model("Cart", cartSchema);