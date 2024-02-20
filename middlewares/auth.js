import jwt from 'jsonwebtoken';
export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (!data) return res.status(400).json({ message: "Authentication failed" , auth : false });
            req.userId = data.id;
            next();
        })
    } catch (error) { 
        res.status(500).json({ message: "Something went wrong !" });
    }
}