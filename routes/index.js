var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
/* GET home page. */


// const url = `mongodb + srv://sand:sand@cluster0.l7bit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

router.get('/', function (req, res, next) {
  res.json({ message: 'hello word' });
})


// var BuyProduct = new mongoose.Schema({
//   Product_Name: { type: String, required: true },
//   Product_Price: { type: String, required: true },
//   User_Name: { type: String, required: true },
//   User_email: { type: String, required: true },
//   User_Number: { type: String, required: true }
// }, { collection: 'products' });

// var product = mongoose.model('products', BuyProduct);

// router.post('/buyProduct', (req, res) => {
//   try {
//     var data = new product(req.body);
//     data.save();
//     res.send({
//       message: "buy successful",
//       message: data
//     })
//   } catch {
//     res.json({ message: 'error' })
//   }

// })


module.exports = router;
