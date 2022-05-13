import * as peer from './modules/peer.js'
const videoContainer = document.querySelector('.classroom__student-container')

const app = {
    init: () => {        
        if(app.check()){
            peer.init()
        }
    },
    check: ()=>{
        if(videoContainer){
            console.log('classroom')
            return true
        }else{
            console.log('classroomn\'t')
            return false
        }
    }
};
app.init();