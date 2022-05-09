const express = require('express')
const route = express.Router()

route.get("/workgroups",(req,res)=>{
    res.status(200).render("workgroups/workgroups.ejs",{page_name:'workgroups'})
})

module.exports = route