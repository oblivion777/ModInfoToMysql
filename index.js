var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var events = require('events');
var URL = require('url');
var fs = require('fs');
var mysql = require('mysql');
var writeMysql = require('./writeMysql');
var eventEmitter = new events.EventEmitter();

const httpsOption = {
    key: fs.readFileSync("./ssl-key/cloudflare.remin.cc.key"),
    cert: fs.readFileSync("./ssl-key/cloudflare.remin.cc.crt")
}

function sendToMysql(request, response) {
    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    console.log(request.body);
    let path = request.body.path;
    let ipaddr = request.body.ip;

    //url.searchParams.get
    var action = URL.parse(request.url, true).query.action;
    if (action === 'mysql') {

        if (path != undefined && ipaddr != undefined) {
            writeMysql.writeMysql(path, ipaddr);
        }
       // console.log('666');
    }
    //response.writeHead(200, { 'Content-Type': 'text/plain' });

    // 发送响应数据 "Hello World"
    response.set("Access-Control-Allow-Origin", "*",);
    response.send(200, 'Hello World!\n');
};

function main(request, response) {

    const url=URL.parse(request.url, true);
    var action = url.query.a;
    let path = url.query.path;
    let ipaddr = url.query.ip;
    console.log(url.query);
    if (action === 'mysql') {

        if (path != undefined && ipaddr != undefined) {
            writeMysql.writeMysql(path, ipaddr);
        }
      //  console.log('666');
    }
    response.set("Access-Control-Allow-Origin", "*",);
    response.send(200, 'Hello World!\n');
}

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', main);
//app.post('/', sendToMysql);

https.createServer(httpsOption, app).listen(7233);
http.createServer(app).listen(7232);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8787/');


process.on('uncaughtException', function (err) {
    //打印出错误
    //console.log(err);
    //打印出错误的调用栈方便调试
    //console.log(err.stack);
});
