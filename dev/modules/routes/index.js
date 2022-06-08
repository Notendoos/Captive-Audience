const express = require('express')
const route = express.Router()

route.get("/",(req,res)=>{
    res.redirect('/classes')
    // res.status(200).render("home/home.ejs",{page_name:'home'})
})

module.exports = route