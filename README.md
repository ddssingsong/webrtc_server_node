# webrtc服务器端

---
## 简介

服务器端代码和浏览器端代码

目前只支持chrome和opera浏览器

## 安装和使用

1. 安装Node.js及npm环境
2. 部署turnserver,参见https://github.com/coturn/coturn.git
3. 下载源码到本地，并解压缩
4. 移动到解压后的目录下
5. 使用命令`npm install`安装所需要的库
6. 运行命令`npm start`，建议配合`forever`
7. 访问`localhost:3000#roomName`查看效果，其中`roomName`为进入的房间名，不同房间的用户无法互相
8. 部署服务器的话需要使用nginx或者apache2配置https和wss的代理

##   nginx代理https和wss

```shell
 #代理https
 upstream web {
    server 0.0.0.0:3000;      
        }
 #代理websocket
 upstream websocket {
    server 0.0.0.0:3000;   
        }
        
 server { 
    listen       443; 
    server_name  localhost;
	ssl          on;

    ssl_certificate     /cert/cert.crt;#配置证书
    ssl_certificate_key  /cert/cert.key;#配置密钥

	ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  50m;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 SSLv2 SSLv3;
    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    #charset koi8-r;
    #access_log  logs/host.access.log  main;
    
  #wss 反向代理  
  location /wss {
     proxy_pass http://websocket/; # 代理到上面的地址去
     proxy_read_timeout 60s;
     proxy_set_header Host $host;
     proxy_set_header X-Real_IP $remote_addr;
     proxy_set_header X-Forwarded-for $remote_addr;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection 'Upgrade';	
  }
  #https 反向代理
  location / {
     proxy_pass         http://web/;
     proxy_set_header   Host             $host;
     proxy_set_header   X-Real-IP        $remote_addr;
     proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
  }
}
```

