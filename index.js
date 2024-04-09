const express = require('express');
const cors = require('cors');
const app = express();
var port = process.env.PORT || 7777;

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/getSellReport', (req, res) => {
    var mysql = require('mysql');
    var StartDate = req.body.StartDate;
    var EndDate = req.body.EndDate;
    console.log("Node" + StartDate, EndDate);
    const sql = `SELECT r.RecID, r.PayTime, SUM(rl.Qty) as Qty, r.TotalPrice, Sum((p.PricePerUnit - p.CostPerUnit) * rl.Qty) as Profit, r.Vat, Sum(p.CostPerUnit * rl.Qty) as Cost 
    FROM receipt r 
    JOIN receipt_list rl 
    ON r.RecID = rl.RecID 
    JOIN product p 
    ON rl.ProID = p.ProID 
    WHERE r.PayTime >= ? AND r.PayTime <= ? 
    GROUP BY r.RecID`;
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'myStore'
    });

    connection.connect();
    connection.query(sql, [StartDate, EndDate], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
    connection.end();
});

app.post('/payerDetail', (req, res) => {
    const { ReceiptID } = req.body;
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'myStore'
    });

    connection.connect();
    const query = `
        SELECT r.PayTime, r.TotalPrice, r.Vat,
            p.PayerFName, p.PayerLName, p.PayerTel, p.PayerAddress, p.PayerProvince, p.PayerPostcode, p.TAG, p.PayerTaxID,
            pd.ProName, pd.Author, pd.PricePerUnit, rl.Qty
        FROM RECEIPT r 
        JOIN PAYER p ON r.PayerID = p.PayerID 
        JOIN RECEIPT_LIST rl ON r.RecID = rl.RecID
        JOIN PRODUCT pd ON rl.ProID = pd.ProID
        WHERE r.RecID = ?`;
    connection.query(query, [ReceiptID], function (error, detail, _fields) {
        if (error) {
            throw error;
        } else {
            res.json(detail);
        }
    });
});



app.listen(port, function () {
    console.log("Listening node.js on port " + port);
});