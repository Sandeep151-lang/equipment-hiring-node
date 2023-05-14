const express = require('express')
const bodyParser = require('body-parser');
const product = require('./api/product')
const app = express()


const PORT = 5000;
var createProduct = require('./routes/createProduct')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var payment = require('./routes/payments')
const cors = require("cors");



app.use(cors({origin:"*"}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

    app.use("/api/product",product)
    app.use('/', indexRouter);
    app.use('/', usersRouter);
    app.use('/', payment)
    app.use('/', createProduct);



app.listen(PORT,()=> console.log(`server is running in ${PORT}`))

module.exports = app