var roomName = location.hash.replace('#','');
if( roomName === ""){
    roomName = "home";
}

var socket = io();
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

socket.emit('join', roomName);







socket.on('w' , ()=>{
    console.log("I'm White");
    
})

