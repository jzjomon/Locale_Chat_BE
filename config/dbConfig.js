import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL)
        console.log("Mongodb connection established");
    } catch (error) {
        console.log("Failed to connect to MongoDB");
    }
}