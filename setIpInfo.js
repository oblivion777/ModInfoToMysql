var http = require('http');
var https = require('https');
var mysql = require('mysql');
var fs = require('fs');

const mysqlConfig = JSON.parse(fs.readFileSync("./ssl-key/mysql-key.json"));
const connectMysql = mysql.createConnection(mysqlConfig);

//getIpInfo("102.165.16.85");

connectMysql.query(`SELECT ip FROM ip WHERE country IS NULL`, function (err, result) {
    for (var key in result) {
        let value = result[key].ip;
        //console.log(value);
        setIpInfo(value);
        //await sleep(199);
        
    }
});

function setIpInfo(ip = "") {
    https.get(`https://ip.remin.cc/json/${ip}`, function (res) {
        let data = "";
        res.on("data", function (chunk) {
            data += chunk;
        })
        res.on("end", function () {
            var info = JSON.parse(data);
            console.log(info.country + "|" + info.city);
            toMysql(info);
        })

    });
};

function toMysql(info) {
    connectMysql.query(`UPDATE ip SET country="${info.country}",city="${info.city}" WHERE ip="${info.query}"`, function (err, result) {
        //console.log(result);
    });
}
