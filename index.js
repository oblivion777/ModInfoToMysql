var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var events = require('events');
var URL = require('url');
var fs = require('fs');
var MyAES = require('./AES');
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

    const url = URL.parse(request.url, true);

    //解密字符串
    if (url.query.c == undefined || url.query.v == undefined) {
        log(request, { warn: "URL参数有误" });
        return;
    }
    const decryptStr = MyAES.decryptStr(url.query.c, url.query.v);
    var decryptJSON;
    try {
        decryptJSON = JSON.parse(decryptStr);
    } catch (error) {
        log(request, { warn: "无法解密字符串" });
        return;
    }

    console.log("search:" + url.search);
    log(request, decryptJSON);//输出日志

    var action = decryptJSON.a;
    let path = decryptJSON.path;
    let ipaddr = decryptJSON.ip;
    if (action === 'mysql') {

        if (path != undefined && ipaddr != undefined) {
            writeMysql.writeMysql(path, ipaddr);
        }
        //  console.log('666');
    } else {
        //禁止不带参数的URL连接
        return;
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
console.log('Server running,http(7232) https(7233)');


process.on('uncaughtException', function (err) {
    //打印出错误
    //console.log(err);
    //打印出错误的调用栈方便调试
    //console.log(err.stack);
});

let logfile = fs.createWriteStream("./runtime.log", {
    flags: "a",
    encoding: "utf-8"
});
let logout = new console.Console(logfile);
function log(request, decryptJSON) {
    let moment = require('moment');
    const url = URL.parse(request.url, true);
    var loginfo = JSON.stringify(decryptJSON);
    loginfo = JSON.parse(loginfo);
    loginfo["reqIP"] = request.ip;
    loginfo["logTime"] = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(JSON.stringify(loginfo));
    logout.log(`${JSON.stringify(loginfo)},`);
}