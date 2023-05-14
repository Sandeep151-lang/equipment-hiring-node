var jwt = require('jsonwebtoken');
const User = require('../model/userSchema');


const jwtAuth = async (req, res, next) => {
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
        res.status(401).json({ message: ` user jwt token error` })
    }
}

// const authenticate = async (req, res, next) => {

//     const token = req.headers.authorization.split("")[1];
//     const user = jwt.verify(token, "sandeepnandanwarfullstackdeveloper")
//     req.user = user;
//     next();

// }
module.exports = jwtAuth;