var videos = document.getElementById("videos");
var sendBtn = document.getElementById("sendBtn");
var msgs = document.getElementById("msgs");
var sendFileBtn = document.getElementById("sendFileBtn");
var files = document.getElementById("files");
var rtc = SkyRTC();

/**********************************************************/
sendBtn.onclick = function (event) {
    var msgIpt = document.getElementById("msgIpt"),
        msg = msgIpt.value,
        p = document.createElement("p");
    p.innerText = "me: " + msg;
    //广播消息
    rtc.broadcast(msg);
    msgIpt.value = "";
    msgs.appendChild(p);
};

sendFileBtn.onclick = function (event) {
    //分享文件
    rtc.shareFile("fileIpt");
};
/**********************************************************/


//对方同意接收文件
rtc.on("send_file_accepted", function (sendId, socketId, file) {
    var p = document.getElementById("sf-" + sendId);
    p.innerText = "对方接收" + file.name + "文件，等待发送";

});
//对方拒绝接收文件
rtc.on("send_file_refused", function (sendId, socketId, file) {
    var p = document.getElementById("sf-" + sendId);
    p.innerText = "对方拒绝接收" + file.name + "文件";
});
//请求发送文件
rtc.on('send_file', function (sendId, socketId, file) {
    var p = document.createElement("p");
    p.innerText = "请求发送" + file.name + "文件";
    p.id = "sf-" + sendId;
    files.appendChild(p);
});
//文件发送成功
rtc.on('sended_file', function (sendId, socketId, file) {
    var p = document.getElementById("sf-" + sendId);
    p.parentNode.removeChild(p);
});
//发送文件碎片
rtc.on('send_file_chunk', function (sendId, socketId, percent, file) {
    var p = document.getElementById("sf-" + sendId);
    p.innerText = file.name + "文件正在发送: " + Math.ceil(percent) + "%";
});
//接受文件碎片
rtc.on('receive_file_chunk', function (sendId, socketId, fileName, percent) {
    var p = document.getElementById("rf-" + sendId);
    p.innerText = "正在接收" + fileName + "文件：" + Math.ceil(percent) + "%";
});
//接收到文件
rtc.on('receive_file', function (sendId, socketId, name) {
    var p = document.getElementById("rf-" + sendId);
    p.parentNode.removeChild(p);
});
//发送文件时出现错误
rtc.on('send_file_error', function (error) {
    console.log(error);
});
//接收文件时出现错误
rtc.on('receive_file_error', function (error) {
    console.log(error);
});
//接受到文件发送请求
rtc.on('receive_file_ask', function (sendId, socketId, fileName, fileSize) {
    var p;
    if (window.confirm(socketId + "用户想要给你传送" + fileName + "文件，大小" + fileSize + "KB,是否接受？")) {
        rtc.sendFileAccept(sendId);
        p = document.createElement("p");
        p.innerText = "准备接收" + fileName + "文件";
        p.id = "rf-" + sendId;
        files.appendChild(p);
    } else {
        rtc.sendFileRefuse(sendId);
    }
});
//成功创建WebSocket连接
rtc.on("connected", function (socket) {
    //创建本地视频流
    rtc.createStream({
        "video": true,
        "audio": true
    });
});
//创建本地视频流成功
rtc.on("stream_created", function (stream) {
    document.getElementById('me').srcObject = stream;
    document.getElementById('me').play();
    // 设置本地不播放自己的声音
    document.getElementById('me').volume = 0.0;
});
//创建本地视频流失败
rtc.on("stream_create_error", function () {
    alert("create stream failed!");
});
//接收到其他用户的视频流
rtc.on('pc_add_stream', function (stream, socketId) {
    var newVideo = document.createElement("video");
    var id = "other-" + socketId;
    newVideo.setAttribute("class", "other");
    newVideo.setAttribute("autoplay", "autoplay");
    newVideo.setAttribute("id", id);
    videos.appendChild(newVideo);
    rtc.attachStream(stream, id);
});
//删除其他用户
rtc.on('remove_peer', function (socketId) {
    var video = document.getElementById('other-' + socketId);
    if (video) {
        video.parentNode.removeChild(video);
    }
});
//接收到文字信息
rtc.on('data_channel_message', function (channel, socketId, message) {
    var p = document.createElement("p");
    p.innerText = socketId + ": " + message;
    msgs.appendChild(p);
});
//连接WebSocket服务器
rtc.connect("wss:" + window.location.href.substring(window.location.protocol.length).split('#')[0]+"/wss", window.location.hash.slice(1));