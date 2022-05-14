(() => {

    const socket = io('/')
    const peer = new Peer(undefined, {
        path: '/peerjs',
        host: window.location.origin,
        port
    })

    const videoContainer = document.querySelector('.video-personal')
    const videoContainers = document.querySelectorAll('.video-student')
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
                        video.classList.add('new-user')
                        call.on('stream', (userVideoStream) => {
                            console.log('someone-joined')
                            app.addVideoStream(video, userVideoStream)
                        })
                    })
                    socket.on('user-connected', (userID) => {
                        app.connectToNewUser(userID, stream);
                    })
                });
        },
        addVideoStream: (video, stream, personal = true) => {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
                videoContainer.append(video);
            });
            // if(personal){
            // }else{
            //     let emptyVideoContainer = []
            //     videoContainers.forEach((el,i)=>{
            //         let check = true
            //         el.childNodes.forEach((ele)=>{
            //             if(ele.nodeName == 'VIDEO'){
            //                 check = false
            //                 console.log(ele)
            //             }
            //         })
            //         if(check){
            //             emptyVideoContainer.push(el)
            //             check = true
            //         }
            //     })
            //     if(emptyVideoContainer[0]){
            //         video.addEventListener('loadedmetadata', () => {
            //             video.play();
            //             video.classlist.add('new-video')
            //             emptyVideoContainer[0].append(video);
            //         });
            //     }
            // }
        },
        connectToNewUser: (userID, stream) => {
            const call = peer.call(userID, stream);
            const video = document.createElement('video');
            call.on('stream', (userVideoStream) => {
                app.addVideoStream(video, userVideoStream, false);
            });
        }
    };
    app.init();

    peer.on('open', (id) => {
        socket.emit('join-room', roomID, id);
    });

})()