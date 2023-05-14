// var express = require('express');
// var router = express.Router();
// var mongoose = require('mongoose');
// var multer = require('multer');
// /* GET home page. */

// var Storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, "../images");
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//     },
// });

// var upload = multer({ storage: Storage })

// require('./dbConn.js/conn');


// var BuyProduct = new mongoose.Schema({
//     Product_name: { type: String, required: true },
//     Product_price: { type: Number, required: true },
//     User_name: { type: String, required: true },
//     User_email: { type: String, required: true },
//     User_number: { type: String, required: true }
// }, { collection: 'product' });

// var product = mongoose.model('product', BuyProduct);



// var products = new mongoose.Schema({
//     Product_Name: { type: String, required: true },
//     Product_Price: { type: Number, required: true },
//     Product_time: { type: Number, required: true },
//     Product_image: { type: String }
// }, { collection: 'equip' });

// var productDetails = mongoose.model('equipments', products);

// router.post('/createProduct', function (req, res) {
//     var data = new productDetails(req.body);
//     data.save();
//     console.log(req.file)
//     res.send({
//         message: "Product Created",
//         message: data
//     })
// });

// router.get('/getProduct', function (req, res) {
//     productDetails.find().then((doc) => {
//         res.send({ item: doc })
//     })
// });



// router.post('/buyProduct', async (req, res) => {
//     var buy = new product(req.body);
//     buy.save();
//     res.status(200).send({
//         message: "buy successful",
//         message: buy
//     })
// })


// module.exports = router;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var Product = require('../model/productSchema');
var adminAuth = require('../authenticate/adminauth');
var uniqueSlug = require('unique-slug')
var Product2 = require('../model/Product2Schema')


require('./dbConn.js/conn');
var products = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    parentId: {
        type: String
    }
}, { collection: 'equip' });

var productDetails = mongoose.model('equipments', products);






//admin authenticate middleware 
const adminrole = (req, res, next) => {
    if (req.rootUser.role === "admin") {
        next();
    } else {
        alert(`only admin can access`)
        return res.status(500).json({ message: `only admin can access` })
    }
}

//Post method creating products
router.post('/createProduct', function (req, res) {
    const categoryObj = {
        name: req.body.name,
        image: req.body.image
    }
    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }
    const cat = new productDetails(categoryObj);
    cat.save((error, category) => {
        if (error) return res.status(400).json({ error });
        if (category) {
            return res.status(201).json({ category })
        }
    });
});



// router.post('/product', adminAuth, adminrole, upload.single('images'), async function (req, res) {
//     try {
//         var imagefile = req.file.filename;
//         const product = new Product({
//             user: req.rootUser._id,
//             product_name: req.body.product_name,
//             product_price: req.body.product_price,
//             product_description: req.body.product_description,
//             product_image: `http://localhost:5000/uploads/${imagefile}`
//             // product_image:imagefile
//         })
//         await product.save().then(() => {
//             res.status(201).json({ message: `product created successfully` })
//         }).catch(() => {
//             res.status(400).json({ message: `product not created` })
//         })
//     } catch {
//         res.status(400).json({ message: `only admin can access` })
//     }
// })

/* GET home page. */
//Get all products listing
router.get('/getproduct', async function (req, res) {
    try {
        await productDetails.find().then((doc) => {
            res.status(200).json({ message: doc })

        })
    } catch {
        res.json({ message: `product not get` })
    }
});

// function createCategories(categories, parentId = null) {
//     const categoryList = [];
//     let category;
//     if (parentId == null) {
//         category = categories.filter(cat => cat.parentId == undefined);
//     } else {
//         category = categories.filter(cat => cat.parentId == parentId)
//     }
//     for (let cate of category) {
//         categoryList.push({
//             _id: cate._id,
//             name: cate.name,
//             slug: cate.slug,
//             image: cate.image,
//             children: createCategories(categories, cate._id)
//         });
//     }

//     return categoryList;
// };
// router.get('/getCategory', async (req, res) => {
//     try {
//         productDetails.find({}).exec((error, categories) => {
//             if (error) return res.status(400).json(error);
//             if (categories) {
//                 const categoryList = createCategories(categories);
//                 res.status(200).json({ categoryList })
//             }
//         })
//     } catch {
//         res.status(400).json(`error`)
//     }

// })

router.delete('/item/:_id', async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.params._id }).then((item) => {
            return res.json({ message: 'deleted' })
        })
    } catch {
        return res.status(400).json({ message: `error` })
    }
})


router.post('/product', async (req, res) => {
    const { name, image, product_name, price, description, description1, list1, list2, list3 } = req.body
    if (!image || !product_name || !price || !description || !description1 || !list1 || !list2 || !list3) {
        return res.status(400).json('Please fill the required field')
    }
    if (!name) {
        return res.status(400).json('please select category')
    }

    const product = new Product({
        user: req.body._id,
        name: name,
        image: image,
        product_name: product_name,
        price: price,
        description: description,
        description1: description1,
        list1: list1,
        list2: list2,
        list3: list3
    })

    product.save((error, product) => {
        if (error) return res.status(400).json('Product Not Created');
        if (product) {
            return res.status(201).json("Product Created")
        }
    });
})

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
        }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }
}

// router.get('/getProduct/:name', async (req, res) => {
//     const { name } = req.params;
//     Product.findOne({ name: name }).select('_id').exec((error, category) => {
//         if (category) {
//             Product.find({ category: category._id }).exec((error, product) => {

//                 if (product) {
//                     res.status(200).json({ product: product })
//                 }
//             })
//         }
//     })

// })

router.get('/getProducts', async (req, res) => {
    // const { name } = req.params;
    const apiFeature = new ApiFeatures(Product.find(), req.query).search();
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products
    })

})


// router.post('/category', async (req, res) => {
//     const { name, image, product } = req.body
//     const product2 = new Product2({
//         user: req.body._id,
//         name: name,
//         product: product,
//         image: image
//     })
//     product2.save((error, product) => {
//         if (error) return res.status(400).json(Error);
//         if (product) {
//             return res.status(201).json(product)
//         }
//     });
// })

router.get('/lost/:_id', async (req, res) => {
    try {
        await Product.findOne({ _id: req.params._id }).then((item) => {
            return res.json({ message: item })
        })
    } catch {
        return res.status(400).json({ message: `error` })
    }
})
// router.get('/category/:name', async (req, res) => {
//     const { name } = req.params;
//     productDetails.findOne({ name: name }).select('_id').exec((error, category) => {


//         if (category) {
//             Product2.find({ category: category._id }).exec((error, product) => {

//                 if (product) {
//                     res.status(200).json({ product: product })
//                 }

//             })
//         }
//     })

// })

module.exports = router;