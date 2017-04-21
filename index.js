var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);


var Room = function(room) {
    var self = this;
    room = room || {};
    self.name = room.name || "";
    self.members = room.members || [];

    return self;
};




app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(5000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on("chat message", function (msg) {
        console.log(msg);
    });
});


