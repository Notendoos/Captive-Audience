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

    onlineUsers.push(thisUser)

    socket.on('join-class',(roomID, userID)=>{
        console.log(`${userID} joined ${roomID}`)
        thisUser = userID
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected',userID)
    })

    socket.on("disconnect",(data)=>{
        console.log(`${thisUser} disconnected`)
        if(onlineUsers.indexOf(thisUser) > -1){
            onlineUsers.splice(onlineUsers.indexOf(thisUser),1)
        }
        io.emit("online users",onlineUsers)
    })

    socket.on('user-seated',(data)=>{
        if(data.reseated){
            console.log(`User reseated at ${data.new.table},${data.new.chair} from ${data.old.table},${data.old.chair}`)
            socket.broadcast.emit('user-seated',data)
        }else{
            console.log(`User seated at ${data.new.table},${data.new.chair}`)
            socket.broadcast.emit('user-seated',data)
        }
        console.log(io.sockets.adapter.rooms)
    })
})



http.listen(port,(a,b)=>{
    console.log(`Exposed on port ${port}`)
})