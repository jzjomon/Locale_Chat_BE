import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    chatId: {
        type: mongoose.Types.ObjectId,
        ref : 'chat'
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    text: {
        type: String
    },
    // read: {
    //     type: Boolean
    // }
},{
    timestamps : true
});

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;