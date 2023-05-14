var express = require('express');
var router = express.Router();
var User = require('../model/userSchema');
var bcrypt = require('bcrypt');
var jwtAuth = require('../authenticate/auth')
var jwt = require('jsonwebtoken');
var orderlist = require('../model/paymentSchema')

/* GET users listing. */


require('./dbConn.js/conn')
router.post('/register', async (req, res, next) => {
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
        var user_register = await User({ name, email, password: hash });

        user_register.save();
        return res.status(200).send({ message: 'successfull' }) && req.send({ message: 'succes' })
        next();
      }

    } catch (error) {
      return res.status(400).send({ message: 'error' })
    }


  }
})



//POST METHOD FOR LOGING THE USERS
router.route('/login').post(async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.send({ message: 'plz filled the data' })
    } else {
      const singin = await User.findOne({ email: email });
      if (singin) {
        const isMatch = await bcrypt.compare(password, singin.password);
        const token = await singin.generateAuthtoken();
        // const token = jwt.sign({ _id: singin._id }, "sandeepnandanwarfullstackdeveloper", { expiresIn: '1h' });
        res.cookie("jwt", token, {
          path: "/",
          expires: new Date(Date.now() + 30000000),
          httpOnly: true
        })
        const { name, email } = singin;

        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid' })
        } else {
          return res.json({ token, name, email })
          next()
        }
      } else {
        return res.status(400).json({ message: 'Invalid' })
      }
    }
  } catch (error) {
    return res.status(400).send({ message: 'Invalid' })
  }
})


//GET METHOD  ALL THE USERS LIST
router.get('/user', async function (req, res) {
  const PAGE_SOZE = 5;
  const page = parseInt(req.query.page || "0");
  const total = await User.countDocuments({});
  try {
    await User.find().limit(PAGE_SOZE).skip(PAGE_SOZE * page).then((doc) => {
      res.status(200).json({ item: doc, totalPages: Math.ceil(total / PAGE_SOZE) })
    })
  } catch {
    res.json({ message: `error` })
  }
})

router.put('/userUpdate', async (req, res) => {
  let { value, item } = req.body
  try {
    const upd = await User.findOneAndUpdate({ _id: item }, { $set: { role: value } })
    res.send(upd)
  } catch {
    return res.status(400).json({ message: 'error' })
  }
})

//GET THE USERS DETAILS AFTER LOGIN
router.get('/about', jwtAuth, (req, res) => {
  res.json({ message: req.rootUser })
  // res.send(req.rootUser)
})


//GET METHODS FOR LOGOUT TO CLEAR COOKIES
router.get('/logout', async (req, res) => {
  res.clearCookie('jwt', { path: '/' });
  res.status(200).json({ message: `logout successfull` })
})

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

router.delete('/list/:_id', async (req, res) => {

  try {
    await orderlist.deleteOne({ _id: req.params._id }).then((item) => {
      return res.json({ message: 'deleted' })
    })
  } catch {
    return res.status(400).json({ message: `error` })
  }

})

router.put('/product/list/:_id', async (req, res) => {
  let { value } = req.body
  try {
    const upd = await orderlist.findOneAndUpdate({ _id: req.params._id }, { $set: { status: value } })
    res.send(upd)
  } catch {
    return res.status(400).json({ message: 'error' })
  }
})
module.exports = router;
