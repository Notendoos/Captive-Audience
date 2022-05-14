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
    let thisUser
    console.log(socket.id)
    socket.emit('hello',socket.id)

    socket.on('click',(data)=>{
        console.log(data)
    })
    socket.on('join-room',(roomID, userID)=>{
        console.log(`${userID} joined ${roomID}`)
        thisUser = userID
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected',userID)
    })
})



http.listen(port,(a,b)=>{
    console.log(`Exposed on port ${port}`)
})