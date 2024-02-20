import USER from '../models/user.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
    try {
        const { firstname, lastname, email, location, password } = req.body.details;
        if (firstname && lastname && email && location && password) {
            const exist = await USER.findOne({ email: email });
            if (exist) return res.status(400).json({ message: "allready have an account !" });
            bcrypt.hash(password, parseInt(process.env.SALT), async (err, hash) => {
                if (err) return res.status(400).json({ message: "hashing error" });
                const result = await USER({ firstname, lastname, email, location, password: hash }).save();
                if (!result) return res.status(400).json({ message: "cannot save the user details" });
                res.status(200).json({ message: "successfully saved the user details" });
            })
        } else {
            return res.status(400).json({ message: "validation error" });
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "validation failed" });
        const exist = await USER.findOne({ email });
        if (!exist) return res.status(400).json({ message: "You don't have an account. Please sign up !" });
        bcrypt.compare(password, exist.password, (err, result) => {
            if (err) return res.status(400).json({ message: "bcrypt compare failed" });
            if (!result) return res.status(400).json({ message: "incorrect password" });
            jwt.sign({ id: exist._id }, process.env.JWT_SECRET, (err, token) => {
                if (err) return res.status(400).json({ message: "Something went wrong !" });
                res.status(200).json({ message: "success", data: exist, token });
            })
        })         
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })

    }
}