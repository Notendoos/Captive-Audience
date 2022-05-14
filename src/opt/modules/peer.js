let myVideoStream
const videoContainer = document.querySelector('.video-personal')
const myVideo = document.createElement("video");
const socket = io()
const peer = new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port
})

myVideo.id = 'userVideo'

myVideo.muted = true;

const init = ()=>{
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        peer.on('call',(call)=>{
            call.answer(stream)
            const video = document.createElement('video')
            call.on('stream',(userVideoStream)=>{
                addVideoStream(video,userVideoStream)
            })
        })
    });
}

// const addVideoStream = (video, stream) => {
//     video.srcObject = stream;
//     video.addEventListener("loadedmetadata", () => {
//         video.play();
//         videoContainer.append(video);
//     });
// };

socket.on('hello',(data)=>{
    console.log(data)
})

// const connectToNewUser = (userID, stream)=>{
//     const call = peer.call(userID,stream)
//     const video = document.createElement('video')
//     call.on('stream',(userVideoStream)=>{
//         addVideoStream(video,userVideoStream)
//     })
// }

// socket.on('user-connected',userId=>{
//     connectToNewUser(userId, stream)
// })

// peer.on('open',(id)=>{
//     console.log(roomID,id)
//     socket.emit('join-room', roomID, id)
// })



export { init, addVideoStream }