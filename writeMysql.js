var mysql = require('mysql2');
var fs = require('fs');

exports.writeMysql = function (page = "test", ip = "0.0.0.0") {

    toPV(page);
    toIP(ip);
    //connectMysql.end();
};

function toPV(page = "test") {
    //connectMysql.query(`INSERT INTO pv (page) VALUE ("test2")`);
    connectMysql.execute(`SELECT page,count FROM pv WHERE page= ? `, [page], function (err, result) {
        //console.log(result);
        connectMysql.query(`UPDATE pv SET count=count+1 WHERE page="total_page_views"`);
        if (result[0] == undefined) {
            return connectMysql.execute(`INSERT INTO pv (page) VALUE (?)`, [page]);
        } else {
            return connectMysql.execute(`UPDATE pv SET count=count+1 WHERE page= ? `, [page]);
        };
    });
}

function toIP(ip) {
    connectMysql.query(`SELECT ip,count FROM ip WHERE ip= ? `,[ip], function (err, result) {
        //console.log(result);
        if (result[0] == undefined) {
            return connectMysql.query(`INSERT INTO ip (ip) VALUE (?)`,[ip]);
        } else {
            return connectMysql.query(`UPDATE ip SET count=count+1 WHERE ip= ? `,[ip]);
        };
    });
}

const mysqlConfig = JSON.parse(fs.readFileSync("./ssl-key/mysql-key.json"));
const connectMysql = mysql.createConnection(mysqlConfig);

//connectMysql.query(`SELECT page,count FROM pv`, function (err, result) { console.log(result); })