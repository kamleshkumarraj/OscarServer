import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    card : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "card"
    },
    price : {
        type : Number,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    }
})