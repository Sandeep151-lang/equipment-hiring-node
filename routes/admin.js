var express = require('express');
var router = express.Router();
var User = require('../model/userSchema');
var bcrypt = require('bcrypt');
var authenticate = require('../authenticate/auth');
var jwt = require('jsonwebtoken');
var orderlist = require('../model/paymentSchema')
var adminAuth = require('../authenticate/adminauth');


/* GET users listing. */

require('../dbcon/conn');


//post method admin can register 
router.post('/admin/register', async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).send({ message: 'plz filled the data' });
    } else {
        try {
            const userExist = await User.findOne({ email: email });
            if (userExist) {
                return res.status(400).send({ message: 'Email already exist' })
            } else {
                const hash = await bcrypt.hash(password, 10)
                var user_register = await User({ role: role = "admin", name, email, password: hash });

                user_register.save();
                return res.status(200).send({ message: 'successfull' })
                next();
            }
        } catch (error) {
            return res.status(400).send({ message: 'error' })
        }
    }
})


//admin login post method 
router.post('/admin/login', async (req, res, next) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.send({ message: 'plz filled the data' })
        } else {
            const singin = await User.findOne({ email: email });
            if (singin && singin.role === "admin") {
                const isMatch = await bcrypt.compare(password, singin.password);
                const token = await singin.generateAuthtoken();
                res.cookie("jwt", token, {
                    path: "/",
                    expires: new Date(Date.now() + 30000000),
                    httpOnly: true
                })
                const { name, email } = singin;
                res.json({ token, name, email })
                if (!isMatch) {
                    return res.status(401).send({ message: 'invalid user' })
                } else {
                    return res.status(200).send({ message: 'login success' })
                    next()
                }
            } else {
                console.log(`only admin can access`)
                res.status(400).json({ message: `error` })
            }
        }
    } catch (error) {
        res.status(400).send({ message: 'error' })
    }
})

const adminrole = (req, res, next) => {
    if (req.rootUser.role === "admin") {
        next();
    } else {
        alert(`only admin can access`)
        return res.status(500).json({ message: `only admin can access` })
    }
}

router.get('/lists', async function (req, res, next) {
    try {
        await orderlist.find().then((doc) => {
            return res.send({ item: doc })
        })
    } catch {
        res.status(400).json('error')
    }

});



router.get('/product/:_id', async (req, res) => {
    try {
        await orderlist.findOne({ _id: req.params._id }).then((item) => {
            return res.send({ item: item })
        })
    } catch {
        return res.status(400).json({ message: 'error' })
    }
});



router.put('/product/list/:_id', async (req, res) => {
    let { value } = req.body
    try {
        const upd = await orderlist.findOneAndUpdate({ _id: req.params._id }, { $set: { status: value } })
        res.send(upd)
    } catch {
        return res.status(400).json({ message: 'error' })
    }
})

router.delete('/list/:_id', async (req, res) => {

    try {
        await orderlist.deleteOne({ _id: req.params._id }).then((item) => {
            return res.json({ message: 'deleted' })
        })
    } catch {
        return res.status(400).json({ message: `error` })
    }

})

module.exports = router;