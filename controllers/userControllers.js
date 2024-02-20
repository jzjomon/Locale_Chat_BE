import USER from '../models/user.js';
import CHAT from '../models/chat.js';
import MESSAGES from '../models/message.js'

export const getChats = (req, res) => {
    try {
        CHAT.find({ users: { $elemMatch: { $eq: req.userId } } }).populate('users').then((result) => {
            res.status(200).json({ message: "success", data: result });
        }).catch((err) => {
            res.status(400).json({ message: "User not found" })
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong !" });
    }
}

export const getUser = (req, res) => {
    try {
        USER.find({
            $or: [
                { firstname: { $regex: req.body.input, $options: "i" } },
                { location: { $regex: req.body.input, $options: "i" } }
            ]
        }).then((result) => {
            res.status(200).json({ data: result })
        }).catch((err) => {
            res.status(400).json({ message: "User not found" })
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong !" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const currentUserId = req?.body?.currentUser?._id;
        if (!currentUserId) return res.status(400).json({ message: "User not found" });

        let chat = await CHAT.find({
            $and: [
                { users: { $elemMatch: { $eq: req.userId } } },
                { users: { $elemMatch: { $eq: currentUserId } } },
            ]
        })
        if (chat.length > 0) {
            MESSAGES.find({ chatId: chat[0]._id }).then((result) => {
                res.status(200).json({ messages: result, chatId: chat[0]._id });
            }).catch((err) => {
                res.status(400).json({ message: "cannot find the messages" })
            });
        } else {
            CHAT({ users: [req.userId, currentUserId] }).save().then(result => {
                res.status(200).json({ chatId: result._id });
            }).catch(err => {
                res.status(400).json({ message: "cannot create chat" })
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong !" });
    }
}

export const sendMessage = (req, res) => {
    try {
        const { chatId, sender, text } = req.body;
        MESSAGES({ chatId, sender, text }).save().then((result) => {
            res.status(200).json({ message: "successfully sent message" })
        }).catch((err) => {
            res.status(400).json({ message: "cannot send message" })
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong !" });
    }
}

export const clearChat = (req, res) => {
    try {
        MESSAGES.deleteMany({ chatId: req.body.chatId }).then(async (result) => {
            CHAT.findOneAndUpdate({ $and : [{ users : { $elemMatch : { $eq : req.userId }}}, { users : { $elemMatch : { $eq : req.body.currentUserId }}}]}, { lastmessage: "" }).then((result) => {
                res.status(200).json({ message: "successfully deleted" })
            }).catch((err) => {
                res.status(400).json({ message: "cannot update last message" })
            });
        }).catch((err) => {
            res.status(400).json({ message: "cannot delete messages" });
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}