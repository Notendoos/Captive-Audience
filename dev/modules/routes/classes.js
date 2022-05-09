const express = require('express')
const route = express.Router()

let roomIDs = [
    {
        id:"11b9eea8",
        name:"Inleiding Programeren 1",
        teacher:"J. Faber",
        timestamp:"12:00-13:00"
    },
    {
        id:"33321eb4",
        name:"Inleiding Programeren 2",
        teacher:"J. Faber",
        timestamp:"13:00-14:00"
    },
    {
        id:"715d361e",
        name:"Inleiding Programeren 3",
        teacher:"J. Faber",
        timestamp:"14:00-15:00"
    },
    {
        id:"865d361e",
        name:"Inleiding Programeren 4",
        teacher:"J. Faber",
        timestamp:"15:00-16:00"
    },
    {
        id:"11c9b843",
        name:"Inleiding Programeren 5",
        teacher:"J. Faber",
        timestamp:"16:00-17:00"
    },
]

route.get("/classes",(req,res)=>{
    res.status(200).render("classes/classes.ejs",{page_name:'classes',rooms:roomIDs})
})

route.get("/classes/:class/:name",(req,res)=>{
    res.status(200).render("classes/classroom.ejs",{page_name:'classes',meeting:true})

    let io = res.locals.io
    io.on('connection',(ws)=>{
        ws.on('join-room',(roomID, userID)=>{
            ws.join(roomID)
            ws.to(roomID).broadcast.emit(`User ${userID} connected`,userID)
        })
    })
})



module.exports = route