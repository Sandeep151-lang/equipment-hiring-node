var mongoose = require('mongoose');




// var url = `mongodb+srv://sandeep:sand92177@cluster0.i0wdm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

var url = `mongodb+srv://sand:sand@cluster0.l7bit.mongodb.net/test`
mongoose.connect(url, { useNewUrlParser: true }).then(console.log('connection successfull')).catch((error) => console.log('error'));