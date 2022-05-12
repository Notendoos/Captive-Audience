const express = require('express')
const route = express.Router()

route.get("/messages",(req,res)=>{
    res.status(200).render("messages/messages.ejs",{page_name:'messages'})
})

module.exports = route