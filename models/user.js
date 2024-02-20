import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lastOnline : {
        type : String
    },
    
}, {
    timestamps: true
})

const userModel = mongoose.model("user", userSchema);

export default userModel;