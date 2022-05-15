(() => {

    const socket = io('/')
    const peer = new Peer(undefined, {
        path: '/peerjs',
        host: window.location.hostname,
        port: window.location.hostname == 'tafelen.herokuapp.com' ? '' : port 
    })

    const videoContainer = document.querySelector('.video-personal')
    const videoContainers = document.querySelectorAll('.video-student:not(.video-personal)')
    const myVideo = document.createElement('video')
    const popupEl = document.querySelector('.popup')
    const chairs = document.querySelectorAll('.classroom__chair')

    let myVideoStream

    myVideo.muted = true
    myVideo.classList.add('user')

    let checkOnce = false

    const popup = {
        init:()=>{
            popupEl.querySelector('.popup__close').addEventListener('click',popup.closePopup)
            popupEl.querySelector('.popup__next span:last-child').addEventListener('click',popup.closePopup)
            popupEl.querySelector('.popup__prev').addEventListener('click',popup.prev)
            popupEl.querySelector('.popup__next').addEventListener('click',popup.next)
        },
        closePopup: ()=>{
            popupEl.classList.remove('active')
        },
        prev:()=>{
            const activeSlide = popupEl.querySelector('.popup__slide.active')
            const activeSlideIndicator = popupEl.querySelector('.popup__slide-ball.active')
            if(activeSlide.previousElementSibling){
                activeSlide.previousElementSibling.classList.add('active')
                activeSlide.classList.remove('active')
                activeSlideIndicator.previousElementSibling.classList.add('active')
                activeSlideIndicator.classList.remove('active')
            }
            popupEl.querySelector('.popup__next span:first-child').classList.add('active')
            popupEl.querySelector('.popup__next span:last-child').classList.remove('active')
        },
        next:()=>{
            const activeSlide = popupEl.querySelector('.popup__slide.active')
            const activeSlideIndicator = popupEl.querySelector('.popup__slide-ball.active')
            if(activeSlide.nextElementSibling){
                activeSlide.nextElementSibling.classList.add('active')
                activeSlide.classList.remove('active')
                activeSlideIndicator.nextElementSibling.classList.add('active')
                activeSlideIndicator.classList.remove('active')
                if(activeSlide.nextElementSibling.nextElementSibling){
                    popupEl.querySelector('.popup__next span:first-child').classList.add('active')
                    popupEl.querySelector('.popup__next span:last-child').classList.remove('active')
                }else{
                    popupEl.querySelector('.popup__next span:first-child').classList.remove('active')
                    popupEl.querySelector('.popup__next span:last-child').classList.add('active')
                }
            }
        },
    }
    const tables = {
        init: ()=>{
            chairs.forEach((el)=>{
                el.addEventListener('click',()=>{
                    tables.checkSeat(el)
                })
            })
        },
        checkSeat: (chair)=>{
            const personalSeat = document.querySelector('.classroom__chair.personal')
            if(!personalSeat && !chair.classList.contains('seated')){
                chair.classList.toggle('seated')
                chair.classList.toggle('personal')

                socket.emit('user-seated',{
                    reseated: false,
                    new:{
                        table: chair.parentElement.getAttribute('data-table'),
                        chair: chair.getAttribute('data-chair')
                    }
                })
            }else if(!personalSeat || !chair.classList.contains('seated')){
                personalSeat.classList.remove('seated')
                personalSeat.classList.remove('personal')

                chair.classList.toggle('seated')
                chair.classList.toggle('personal')


                socket.emit('user-seated',{
                    reseated: true,
                    new:{
                        table: chair.parentElement.getAttribute('data-table'),
                        chair: chair.getAttribute('data-chair')
                    },
                    old:{
                        table: personalSeat.parentElement.getAttribute('data-table'),
                        chair: personalSeat.getAttribute('data-chair')
                    }
                })
            }
        },
        seat: (chair)=>{
            chair = document.querySelector(`[data-chair=${chair}]`)
            chair.classList.add('seated')
        },
        clearChair: (chair)=>{
            chair = document.querySelector(`[data-chair=${chair}]`)
            chair.classList.remove('seated')
        }
    }
    const app = {
        init: () => {
            if (app.check()) {
                app.initMedia()
                tables.init()
            }
            popup.init()
        },
        check: () => {
            if(!localStorage.getItem('tafelen-thisUser')){
                localStorage.setItem('tafelen-thisUser',prompt('Wat is je naam') )  
                popupEl.classList.add('active')
            }else{
                console.log(localStorage.getItem('tafelen-thisUser'))
            }
            if (videoContainer) {
                console.log('classroom')
                return true;
            } else {
                console.log('classroomn\'t')
                return false;
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
                            console.log('someone-joined')
                            app.addVideoStream(video, userVideoStream, false)
                        })
                    })
                    socket.on('user-connected', (userID) => {
                        app.connectToNewUser(userID, stream);
                    })
                });
        },
        addVideoStream: (video, stream, personal = true) => {
            video.srcObject = stream;
            if(personal){
                video.addEventListener('loadedmetadata', () => {
                    video.play();
                    videoContainer.append(video);
                });
            }else{
                let emptyVideoContainer = []
                videoContainers.forEach((el,i)=>{
                    let check = true
                    el.childNodes.forEach((ele)=>{
                        if(ele.nodeName == 'VIDEO'){
                            check = false
                            console.log(ele)
                        }
                    })
                    if(check){
                        emptyVideoContainer.push(el)
                        check = true
                    }
                })
                if(emptyVideoContainer[0]){
                    video.addEventListener('loadedmetadata', () => {
                        video.play();
                        video.classList.add('new-user')
                        emptyVideoContainer[0].append(video);
                    });
                }
            }
        },
        connectToNewUser: (userID, stream) => {
            const call = peer.call(userID, stream);
            const video = document.createElement('video');
            call.on('stream', (userVideoStream) => {
                console.log('new-user')
                app.addVideoStream(video, userVideoStream, false);
            });
        }
    };
    app.init();

    peer.on('open', (id) => {
        socket.emit('join-class', roomID, id);
    });

    socket.on('user-seated',(data)=>{
        console.log(data)
        if(data.reseated == false){
            tables.seat(data.new.chair)
        }else{
            tables.seat(data.new.chair)
            tables.clearChair(data.old.chair)
        }
    })

})()