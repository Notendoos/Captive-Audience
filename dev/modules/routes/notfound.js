const express = require('express')
const route = express.Router()

route.get('*',(req,res)=>{
    res.redirect('/')
})

module.exports = route