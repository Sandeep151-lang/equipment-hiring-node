const express = require('express')
const router = express.Router();


router.get("/list",async(req,res)=>{
    try {
        res.json({
            message:"Get"
        })
    } catch (error) {
        return res.status(500).send('errpr')
    }
})

router.post("/post",async(req,res)=>{
    try {
        res.json({
            message : "Get post method"
        })
    } catch (error) {
        return res.status(400).json('error')
    }
})

module.exports = router