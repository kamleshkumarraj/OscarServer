import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    JSONCard: { type: Object, required: true }, // To store the card JSON object
    image : {type : String , required : true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
     },
    title : {type : String , required : true}
},{timestamps : true});

export const Cards = mongoose.model("Card", CardSchema);