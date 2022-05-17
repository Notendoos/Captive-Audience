const
    express = require('express'),
    app = express(),
    http= require('http').Server(app),
    ejs = require('ejs'),
    compression = require('compression'),
    io = require('socket.io')(http),
    { ExpressPeerServer } = require('peer'),
    peerServer = ExpressPeerServer(http,{debug:true})
    port = process.env.PORT || 5000

app.use(compression())
app.use(express.static('src'))
app.set('view engine','ejs')

let onlineUsers = []
let users = []

app.use(function(req,res,next){
    // res.locals.peerServer = peerServer
    res.locals.port = port
    next()
})

const index = require('./dev/modules/routes/index')
const messages = require('./dev/modules/routes/messages')
const classes = require('./dev/modules/routes/classes')
const workgroups = require('./dev/modules/routes/workgroups')
const notFound = require('./dev/modules/routes/notfound')
app.use('/peerjs',peerServer)
app.use('/',index)
app.use('/',messages)
app.use('/',classes)
app.use('/',workgroups)
app.use('/',notFound)

io.on('connection',(socket)=>{
    let thisUser = socket.id
    let chair

    onlineUsers.push({
        socketID:thisUser
    })

    socket.on('join-class',(roomID, userID)=>{
        console.log(`${userID} joined ${roomID}`)
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected',userID)

        let user = onlineUsers.find((user)=>  user.socketID == thisUser)
        user.peerID = userID
    })

    socket.on("disconnect",(data)=>{
        console.log(`${thisUser} disconnected`)
        if(onlineUsers.find((user)=>{return user.socketID == thisUser})){
            try{
                io.emit('clean-up',{
                    user:onlineUsers.find((user)=>{return user.socketID == thisUser}),
                    chair
                }) 
                onlineUsers.splice(onlineUsers.indexOf(onlineUsers.findIndex((user)=>{return user.socketID == thisUser})),1)
            }catch(err){
                console.log(err)
            }
        }
        io.emit("online users",onlineUsers)
    })

    socket.on('user-seated',(data)=>{
        chair = data
        if(data.reseated){
            console.log(`User reseated at ${data.new.table},${data.new.chair} from ${data.old.table},${data.old.chair}`)
            socket.to(data.roomID).broadcast.emit('user-seated',data)
        }else{
            console.log(`User seated at ${data.new.table},${data.new.chair}`)
            socket.to(data.roomID).broadcast.emit('user-seated',data)
        }
        // console.log(io.sockets.adapter.rooms) 
    })
})



http.listen(port,(a,b)=>{
    console.log(`Exposed on port ${port}`)
})