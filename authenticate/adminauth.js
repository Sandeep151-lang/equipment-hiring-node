var jwt = require('jsonwebtoken');
const User = require('../model/userSchema');


const jwtAuthAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyToken = jwt.verify(token, 'sandeepnandanwarfullstackdeveloper');
        // const rootUser = User.findOne({ _id: verifyToken._id, "tokens.token": token });
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token })
        if (!rootUser) { throw new Error('User not Found') }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next()
    } catch {
        res.status(401).json({ message: `error` })
    }
}

module.exports = jwtAuthAdmin;