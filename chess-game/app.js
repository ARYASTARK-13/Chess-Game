const express = require('express');
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
// var roomno = 1;

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
    response.sendFile('/public/ChessBoard.html' , { root : __dirname});
});

http.listen(port, function(){
    console.log("listening on port 3000");
});

var roomInfoList = new Object();
//var turn = 1;

io.sockets.on('connection', function(socket) {

    socket.on('join', function(room) {
        console.log('joining room', room);
        socket.join(room);
        
        if(typeof roomInfoList[room] === 'undefined' ){
            roomInfoList[room] = new Object();
            roomInfoList[room].id_array = new Array();
        }

        if(roomInfoList[room].started === true ){ //undefined by default
            socket.emit('change-room');
        }
        // roomInfoList[room].id_array = new Array();
        roomInfoList[room].id_array.push(socket.id);
        if (roomInfoList[room].id_array.length === 2) {
            // start the game
            var turn = 1;
            io.to(roomInfoList[room].id_array[0]).emit('w');
            io.to(roomInfoList[room].id_array[1]).emit('b');
            roomInfoList[room].started = true;
            roomInfoList[room].gamestate = 'start';
            io.in(room).emit('start-game');
            io.to(roomInfoList[room].id_array[1]).emit('notyourturn');
        }
        socket.on('move', function(msg) {
            io.in(room).emit('move', msg);
            changeTurn(room);
        });
        changeTurn = function(room) {
            turn = 1 - turn;
            if( turn === 0){
                io.to(roomInfoList[room].id_array[0]).emit('notyourturn');
            }
            else{
                io.to(roomInfoList[room].id_array[1]).emit('notyourturn');
            }
        };
    });
});

/*

io.on('connection', function(socket) {
    console.log('new connection');

    socket.emit('message', roomID);
        socket.on('subscribe', function(room) { 
            console.log('joining room', room);
            socket.join(room); 
            console.log(io.sockets.adapter.rooms.get(room).size);
            //console.log(io.nsps['/'].adapter.rooms);
        });
    socket.on('move', function(msg) {
       socket.broadcast.emit('move', msg); 
    });
});

*/

/*
io.on('connection', function(socket) {
    console.log('new connection');
    
    socket.on('move', function(msg) {
       socket.broadcast.emit('move', msg); 
    });
});
*/