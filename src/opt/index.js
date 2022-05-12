import * as peer from './modules/peer.js'
import * as socket from './modules/socket.js'
const app = {
    init: () => {        
        if(peer.check()){
            peer.init()
            socket.init()
        }
    }
};
app.init();