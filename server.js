const
    express = require('express'),
    app = express(),
    http= require('http').Server(app),
    ejs = require('ejs'),
    fetch = require('node-fetch'),
    compression = require('compression'),
    io = require('socket.io')(http),
    { ExpressPeerServer } = require('peer'),
    peerServer = ExpressPeerServer(http,{debug:true})
    port = process.env.PORT || 8080

app.use(compression())
app.use(express.static('src'))
app.set('view engine','ejs')

let onlineUsers = []

app.use(function(req,res,next){
    res.locals.peerServer = peerServer
    res.locals.io = io
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

http.listen(port,(a,b)=>{
    console.log(`Exposed on port ${port}`)
})