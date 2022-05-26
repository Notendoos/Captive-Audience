const express = require('express')
const route = express.Router()

route.get('/seating',(req,res)=>{
    res.status(200).render("classes/seating.ejs",{
        page_name:'classes',
        room:{
            name:req.query.name.replace(/_/g,' '),
            id: req.query.room
        }
    })
})

module.exports = route