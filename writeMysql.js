var mysql = require('mysql2');
var fs = require('fs');

exports.writeMysql = function (page = "test", ip = "0.0.0.0") {

    toPV(page);
    toIP(ip);
    //connectMysql.end();
};

//写入PV数据
function toPV(page = "test") {
    pool.execute(`SELECT page,views FROM pv WHERE page= ? `, [page], function (err, result) {
        //console.log(result);
        pool.query(`UPDATE pv SET views=views+1 WHERE page="total_page_views"`);
        if (result[0] == undefined) {
            return pool.execute(`INSERT INTO pv (page) VALUE (?)`, [page]);
        } else {
            return pool.execute(`UPDATE pv SET views=views+1 WHERE page= ? `, [page]);
        };
    });
}


//写入UV数据
function toIP(ip) {
    pool.query(`SELECT ip,views FROM ip WHERE ip= ? `, [ip], function (err, result) {
        //console.log(result);
        if (result[0] == undefined) {
            return pool.query(`INSERT INTO ip (ip) VALUE (?)`, [ip]);
        } else {
            return pool.query(`UPDATE ip SET views=views+1 WHERE ip= ? `, [ip]);
        };
    });
}

const mysqlConfig = JSON.parse(fs.readFileSync("./ssl-key/mysql-key.json"));
const connectMysql = mysql.createConnection(mysqlConfig);
const pool = mysql.createPool(mysqlConfig);

//connectMysql.query(`SELECT page,views FROM pv`, function (err, result) { console.log(result); })