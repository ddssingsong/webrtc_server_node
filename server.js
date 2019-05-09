const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require("path");
const SkyRTC = require('./public/dist/js/SkyRTC.js').listen(server);
const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

app.use(express.static(path.join(__dirname, 'public')), null);


server.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

SkyRTC.rtc.on('new_connect', function (socket) {
    console.log('创建新连接');
});

SkyRTC.rtc.on('remove_peer', function (socketId) {
    console.log(socketId + "用户离开");
});

SkyRTC.rtc.on('new_peer', function (socket, room) {
    console.log("新用户" + socket.id + "加入房间" + room);
});

SkyRTC.rtc.on('socket_message', function (socket, msg) {
    console.log("接收到来自" + socket.id + "的新消息：" + msg);
});

SkyRTC.rtc.on('ice_candidate', function (socket, ice_candidate) {
    console.log("接收到来自" + socket.id + "的ICE Candidate");
});

SkyRTC.rtc.on('offer', function (socket, offer) {
    console.log("接收到来自" + socket.id + "的Offer");
});

SkyRTC.rtc.on('answer', function (socket, answer) {
    console.log("接收到来自" + socket.id + "的Answer");
});

SkyRTC.rtc.on('error', function (error) {
    console.log("发生错误：" + error.message);
});