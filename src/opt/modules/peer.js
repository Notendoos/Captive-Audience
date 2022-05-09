let myVideoStream
const videoContainer = document.querySelector('.video-personal')
const myVideo = document.createElement("video");

myVideo.id = 'userVideo'

myVideo.muted = true;

const check = ()=>{
    if(videoContainer){
        console.log('classroom')
        return true
    }else{
        console.log('classroomn\'t')
        return false
    }
}

const init = ()=>{
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
    });
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
        videoContainer.append(video);
    });
};

export { check, init, addVideoStream }