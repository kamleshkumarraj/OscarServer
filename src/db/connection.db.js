import mongoose from "mongoose";


export const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Database connected successfully on host : ${connect.connection.host} and port : ${connect.connection.port}`);
}