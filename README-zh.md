# webrtc服务器端

![logo](https://github.com/ddssingsong/webrtc_server_node/tree/master/art/logo1.png)

## 简介

基于 [webrtc](https://webrtc.googlesource.com/) 开发的一套可以进行**单路**或者**多路**语音、视频的系统。



本demo主要是服务器端代码和浏览器端代码

浏览器端展示地址：https://47.93.186.97/#122323

主要是配合Android端代码而开发

[https://github.com/ddssingsong/webrtc_android](https://github.com/ddssingsong/webrtc_android)



## 搭建过程

- **安装node和npm**

  下载官网最新nodejs：https://nodejs.org/en/download/

  ```shell
  wget https://nodejs.org/dist/v10.16.0/node-v10.16.0-linux-x64.tar.xz
  
  # 解压
  tar -xvf node-v10.16.0-linux-x64.tar.xz
  # 改名
  mv node-v10.16.0-linux-x64 nodejs
  # 进入目录
  cd nodejs/
  
  # 确认一下nodejs下bin目录是否有node 和npm文件，如果有就可以执行软连接
  sudo ln -s /home/dds/webrtc/nodejs/bin/npm /usr/local/bin/
  sudo ln -s /home/dds/webrtc/nodejs/bin/node /usr/local/bin/
  
  # 看清楚，这个路径是你自己创建的路径，我的路径是/home/dds/webrtc/nodejs
  
  #查看是否安装
  node -v 
  npm -v 
  
  # 注意，ubuntu 有的是需要sudo,如果不想sudo,可以用下面的命令安装在root环境下
  
  sudo ln -s /home/dds/webrtc/nodejs/bin/node /usr/bin/
  sudo ln -s /home/dds/webrtc/nodejs/bin/npm /usr/bin/
  ```

  

- **coturn安装**

  ```shell
  git clone https://github.com/coturn/coturn 
  cd coturn 
  ./configure 
  make 
  sudo make install
  ```

  配置turnserver.conf

  ```
  listening-ip=本地ip
  listening-port=3478
  
  verbose
  fingerprint
  lt-cred-mech
  realm=test 
  
  min-port=59000
  max-port=65000
  
  user=ddssingsong:123456  #用户名和密码，后面会用到
  
  cert=pem/turn_server_cert.pem #这两个玩意请自行生成
  pkey=pem/turn_server_pkey.pem #
  
  stale-nonce
  no-loopback-peers
  no-multicast-peers
  mobility
  no-cli
  
  ```

  启动

  ```
  turnserver
  ```

  

- 安装本demo

  1. 下载源码到本地，并解压缩
  2. 移动到解压后的目录下
  3. 使用命令`npm install`安装所需要的库
  4. 运行命令`npm start`，建议配合`forever`
  5. 访问`localhost:3000#roomName`查看效果，其中`roomName`为进入的房间名，不同房间的用户无法互相
  6. 部署服务器的话需要使用nginx或者apache2配置https和wss的代理

  ```
  # 代码检出来
  git clone https://github.com/ddssingsong/webrtc_server.git  
  cd webrtc_server
  ```

  SkyRTC-client.js

  ```
     var iceServer = {
          "iceServers": [
            {
              "url": "stun:stun.l.google.com:19302"
            },
            {
              "url": "stun:ip:3478"
            },
            {
               "url": "turn:ip:3478",
               "username":"ddssingsong",
               "credential":"123456"
            }
          ]
      };
  ```

  /public/dist/js/conn.js

  ```
  ## 最后一行
  
  ##  如果没有配wss代理
  
  rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], window.location.hash.slice(1));
  
  如果配了nginx wss代理
  rtc.connect("wss:" + window.location.href.substring(window.location.protocol.length).split('#')[0]+"/wss", window.location.hash.slice(1));
  
  # 后面的那个“/wss”是根据自己配的代理路径
  ```

  运行

  ```
  # 安装依赖
  npm install
  
  # 运行
  node server.js
  ```

  

## 共同探索

QQ群名称：webrtc技术交流群

QQ群   号：601332720

加入群一起探讨webrtc，分享好的开源项目



