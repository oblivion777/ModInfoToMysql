var http = require('http');
var https = require('https');
var mysql = require('mysql2');
var fs = require('fs');
const { exit } = require('process');

const mysqlConfig = JSON.parse(fs.readFileSync("./ssl-key/mysql-key.json"));
const connectMysql = mysql.createConnection(mysqlConfig);

//getIpInfo("102.165.16.85");

toCloudFlare();

function toCloudFlare() {

    connectMysql.query(`SELECT page,count FROM pv`, function (err, result) {
        var resJSON = {};
        for (var key in result) {
            //console.log(result[key]);
            resJSON[result[key].page] = result[key].count;
        }
        fs.writeFile("./JSON-CloudFlare/pv.json", JSON.stringify(resJSON), function (error) {
            console.log("pv done!");
        });
    });

    connectMysql.query(`SELECT ip,count FROM ip`, function (err, result) {
        var resJSON = {};
        for (var key in result) {
            //console.log(result[key]);
            resJSON[result[key].ip] = result[key].count;
        }
        fs.writeFile("./JSON-CloudFlare/uv.json", JSON.stringify(resJSON).replace(/\./g,'_'), function (error) {
            console.log("uv done!");
        });
    });

}