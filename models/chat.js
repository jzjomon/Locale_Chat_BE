import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
    users : [
        { 
            type : mongoose.Types.ObjectId,
            ref : 'user'
        }
    ],
    lastmessage: {
        type : String
    },
}, {
    timestamps: true
});

const chatModel = mongoose.model("chat", chatSchema);

export default chatModel;