(() => {

    const socket = io('/')
    const peer = new Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port
    })

    const videoContainer = document.querySelector('.video-personal')
    const myVideo = document.createElement('video')

    myVideo.muted = true

    let myVideoStream

    const app = {
        init: () => {
            if (app.check()) {
                app.initMedia()
            }
        },
        check: () => {
            if (videoContainer) {
                console.log('classroom')
                return true
            } else {
                console.log('classroomn\'t')
                return false
            }
        },
        initMedia: () => {
            navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                })
                .then((stream) => {
                    myVideoStream = stream;
                    app.addVideoStream(myVideo, stream);
                    peer.on('call', (call) => {
                        call.answer(stream)
                        const video = document.createElement('video')
                        call.on('stream', (userVideoStream) => {
                            app.addVideoStream(video, userVideoStream)
                        })
                    })
                    socket.on('user-connected', (userID) => {
                        app.connectToNewUser(userID, stream);
                    })
                });
        },
        addVideoStream: (video, stream) => {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
                videoContainer.append(video);
            });
        },
        connectToNewUser: (userID, stream) => {
            const call = peer.call(userID, stream);
            const video = document.createElement('video');
            call.on('stream', (userVideoStream) => {
                app.addVideoStream(video, userVideoStream);
            });
        }
    };
    app.init();

    peer.on('open', (id) => {
        socket.emit('join-room', roomID, id);
    });

})()