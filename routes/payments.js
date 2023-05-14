var express = require('express');
var router = express.Router();
//const { v4: uuidv4 } = require('uuid');
const Payments = require('../model/paymentSchema')
const stripe = require('stripe')('sk_test_51K1p90SJsqVvBs7nBt5QMaiBrOaB847tNRNQqvtYzEPMqHDTbuY18uaPmLUHLmAxYl0inI66Nc2N9jXUyWxw5NFN0056EvzNum');
const jauth = require('../authenticate/auth')


require('../routes/dbConn.js/conn')

//Post method Stripe is used for payment  gateway
router.post('/payment', async (req, res) => {
    try {
        console.log(req.body.token, req.body.total);
        const { token, total, cart, name, email, id, address, starttime, Total, endtime } = req.body
        console.log(Total, starttime, endtime);
        stripe.customers
            .create({
                name: name,
                email: email,
                source: token,
            })
            .then(customer => {
                const payment = stripe.charges.create({
                    amount: total * 100,
                    currency: "inr",
                    customer: customer.id
                })
                if (payment) {
                    const order = new Payments({
                        user_id: id,
                        name: name,
                        email: email,
                        cartItems: cart,
                        total: total,
                        shippingAddress: {
                            name: address.name,
                            country: address.address_country,
                            city: address.address_city,
                            address: address.address_line1,
                            pincode: address.address_zip,
                        },
                        starttime: starttime,
                        endtime: endtime,
                        Totalhr: Total
                    })
                    const orders = order.save();
                    if (orders) {
                        return res.status(200).json(`payment success`)
                    } else {
                        return res.status(400).json(`invalid`)
                    }
                }
            }
            )
            .then(() => res.json("payment successfull"))
            .catch(err => console.log(err));
    } catch (err) {
        res.send(err);
    }
})

router.get('/product/:_id', async (req, res) => {
    try {
        await Payments.findOne({ _id: req.params._id }).then((item) => {
            return res.send({ item: item })
        })
    } catch {
        return res.status(400).json({ message: 'error' })
    }
});


//Get methods used to details of users order list
router.get('/getdetails', jauth, async function (req, res, next) {
    try {
        const history = await Payments.find({ user_id: req.rootUser._id })

        res.status(200).json({ message: history })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

process.on('unhandledRejection', () => {
    console.log('please')
})

module.exports = router;
