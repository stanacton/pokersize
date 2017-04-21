"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const napp = require("express");
const nhttp = require("http");
const nio = require("socket.io");
const Room_1 = require("./Room");
const User_1 = require("./User");
var app = napp();
var http = nhttp.Server(app);
var io = nio(http);
var port = process.env.PORT || 3000;
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/:path', function (req, res) {
    res.sendFile(__dirname + '/' + req.params.path);
});
var rooms = {};
var sockets = {};
var users = {};
var defaultRoom = new Room_1.Room();
defaultRoom.name = "default";
rooms["default"] = defaultRoom;
io.on('connection', function (socket) {
    sockets[socket.id] = socket;
    console.log("connected", socket.id);
    socket.on('disconnect', function () {
        for (var room in rooms) {
            var removed = rooms[room].removeUser(socket.id);
            if (removed) {
                io.to(room).emit("update", rooms[room]);
            }
        }
        console.log('user disconnected');
    });
    socket.on("getRooms", function (args, next) {
        next(rooms);
        socket.emit("rooms", rooms);
    });
    socket.on("createRoom", function (args, next) {
        console.log("Creatig Room", args);
        next = next || function () { };
        if (!args || !args.roomName) {
            return next({ status: "ERROR", message: "args.name is required." });
        }
        if (next && (!args || !args.username)) {
            return next({ status: "ERROR", message: "args.username is required." });
        }
        var room;
        if (!rooms[args.roomName]) {
            room = new Room_1.Room();
            room.name = args.roomName;
            rooms[args.roomName] = room;
            room.users.push(new User_1.User(socket.id, args.username));
        }
        else {
            room = rooms[args.roomName];
        }
        socket.join(args.roomName);
        next({ status: "SUCCESS", "room": room });
    });
    socket.on("joinRoom", function (args, next) {
        next = next || function () { };
        if (!args || !args.roomName) {
            return next({ status: "ERROR", message: "args.roomName is required." });
        }
        if (!args || !args.username) {
            return next({ status: "ERROR", message: "args.username is required." });
        }
        var room = rooms[args.roomName];
        if (!room) {
            return next({ status: "ERROR", message: "room not found." });
        }
        var user = new User_1.User(socket.id, args.username);
        users[socket.id] = user;
        room.addUser(user);
        socket.join(args.roomName);
        io.to(args.roomName).emit("update", room);
        next({ status: "SUCCESS" });
    });
    socket.on("leaveRoom", function (args, next) {
        next = next || function () { };
        if (!args || !args.roomName) {
            return next({ status: "ERROR", message: "args.roomName is required." });
        }
        var room = rooms[args.roomName];
        if (!room) {
            return next({ status: "ERROR", message: "room not found." });
        }
        room.removeUser(socket.id);
        socket.leave(args.roomName);
        next({ status: "SUCCESS" });
        io.to(args.roomName).emit("update", room);
    });
    socket.on("vote", function (args, next) {
        next = next || function () { };
        if (!args || !args.vote) {
            return next({ status: "ERROR", message: "args.vote is required." });
        }
        if (!args || !args.roomName) {
            return next({ status: "ERROR", message: "args.roomName is required." });
        }
        var room = rooms[args.roomName];
        if (!room) {
            return next({ status: "ERROR", message: "room not found." });
        }
        room.vote(socket.id, args.vote);
        next({ status: "SUCCESS" });
        io.to(args.roomName).emit("update", room);
    });
    socket.on("newVote", function (args, next) {
        next = next || function () { };
        if (!args || !args.roomName) {
            return next({ status: "ERROR", message: "args.roomName is required." });
        }
        var room = rooms[args.roomName];
        if (!room) {
            return next({ status: "ERROR", message: "room not found." });
        }
        room.newVote();
        next({ status: "SUCCESS" });
        io.to(args.roomName).emit("update", room);
    });
    socket.on("reveal", function (args, next) {
        next = next || function () { };
        if (!args || !args.roomName) {
            return next({ status: "ERROR", message: "args.roomName is required." });
        }
        var room = rooms[args.roomName];
        if (!room) {
            return sockets[socket.id].emit({ status: "ERROR", message: "room not found." });
        }
        next({ status: "SUCCESS" });
        room.reveal = true;
        io.to(args.roomName).emit("update", room);
    });
});
http.listen(port, function () {
    console.log("Listening on *:" + port);
});
