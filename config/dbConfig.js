import mongoose from "mongoose";

export const dbConnect = () => {
    try {
        mongoose.connect(process.env.MONGOURL).then((result) => {
            console.log("Mongodb connection established");
        }).catch((err) => {
            console.log(err.message);
        });
    } catch (error) {
        console.log("Failed to connect to MongoDB");
    }
}