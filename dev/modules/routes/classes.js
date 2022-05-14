const express = require('express')
const route = express.Router()
let baseUrl = '/img/profile'

let roomsData = [
    {
        id:"11b9eea8",
        name:"Marketing 101",
        teacher:"H. Drift",
        timestamp:{
            start: "12:00",
            end:"14:30"
        },
        present:{
            teacher:{
                present:true,
                image:`${baseUrl}/pf5.png`
            },
            students:{
                present:true,
                amount: 20,
                images:[`${baseUrl}/pf2.png`,`${baseUrl}/pf3.png`,`${baseUrl}/pf4.png`,`${baseUrl}/pf5.png`,`${baseUrl}/pf6.png`,`${baseUrl}/pf7.png`]
            }
        }
    },
    {
        id:"33321eb4",
        name:"Internet Standaarden",
        teacher:"B. McMillan",
        timestamp:{
            start: "15:00",
            end:"16:30"
        },
        present:{
            teacher:{
                present:true,
                image:`${baseUrl}/pf7.png`
            },
            students:{
                present:true,
                amount: 3,
                images:[`${baseUrl}/pf2.png`,`${baseUrl}/pf3.png`,`${baseUrl}/pf4.png`,`${baseUrl}/pf5.png`,`${baseUrl}/pf6.png`,`${baseUrl}/pf7.png`]
            }
        }
    },
    {
        id:"715d361e",
        name:"Human Computer Interaction",
        teacher:"E. Webster",
        timestamp:{
            start: "17:30",
            end:"17:45"
        },
        present:{
            teacher:{
                present:true,
                image:`${baseUrl}/pf6.png`
            },
            students:{
                present:false,
                amount: 3,
                images:[`${baseUrl}/pf2.png`,`${baseUrl}/pf3.png`,`${baseUrl}/pf4.png`,`${baseUrl}/pf5.png`,`${baseUrl}/pf6.png`,`${baseUrl}/pf7.png`]
            }
        }
    },
]
let roomsDataNext = [
    {
        id:"865d361e",
        name:"Internet Standaarden",
        teacher:"B. McMillan",
        timestamp:{
            start: "15:00",
            end:"16:30"
        }
    },
    {
        id:"11c9b843",
        name:"Human Computer Interaction",
        teacher:"E. Webster",
        timestamp:{
            start: "17:30",
            end:"17:45"
        }
    },
]

route.get("/classes",(req,res)=>{
    res.status(200).render("classes/classes.ejs",{page_name:'classes',rooms:roomsData,roomsNext:roomsDataNext})
})

route.get("/classes/:id/:name",(req,res)=>{
    let roomData = roomsData.find((x)=>{
        return x.id == req.params.id
    })
    if(roomData){
        res.status(200).render("classes/classroom.ejs",{page_name:'classes',room:roomData,meeting:true,roomID:roomData.id})
        // console.log('hi')
        // let io = res.locals.io
        // io.on('connection',(ws)=>{
        //     ws.on('join-room',(roomID, userID)=>{
        //         console.log('someone joined')
        //         ws.join(roomID)
        //         ws.to(roomID).broadcast.emit(`User ${roomID} connected`,userID)
        //     })
        // })
    }else{
        res.redirect('/classes')
    }
})



module.exports = route