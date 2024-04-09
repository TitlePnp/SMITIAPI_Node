const express = require('express');
const cors = require('cors');
const app = express();
var port = process.env.PORT || 7777;

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// ต่อไปนี้คือ route handlers ของคุณ

app.get('/', (req, res) => {
    // res.send('Hello World!!!');
    // res.json({ message: 'Hello World!!!' });
    const name = req.query.name;
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'myStore'
    });
    
    connection.connect();
    connection.query('SELECT * FROM PRODUCT WHERE ProID = ?', [name], function (error, results, fields) {
        if (error) throw error;
            res.json(results);
    });
    connection.end();
});

app.post('/requestReceipt', (req, res) => {
    const { recID } = req.body;
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'myStore'
    });
    connection.connect();

    connection.query('SELECT pd.ProName, pd.PricePerUnit, p.PayerTaxID, p.PayerFName, p.PayerLName, p.PayerTel, p.PayerAddress, p.PayerProvince, p.PayerPostcode, rl.ProID, rl.Qty, r.PayTime, r.Status FROM Receipt r JOIN Payer p ON r.PayerId = p.PayerId JOIN Receipt_list rl ON rl.RecID = r.RecID JOIN Product pd ON pd.ProID = rl.ProID WHERE r.RecID = ? AND r.Status = "Paid" OR r.Status = "Completed"', [recID], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
    connection.end();
});

app.post('/popularProduct', (req, res) => {
    const { startTime, endTime } = req.body;
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'myStore'
    });
    connection.connect();

    connection.query('SELECT COUNT(rl.ProID) AS ProID , p.ProName, SUM(rl.Qty) AS Sum FROM RECEIPT_LIST rl JOIN PRODUCT p ON p.ProID = rl.ProID JOIN RECEIPT r ON rl.RecID = r.RecID WHERE r.Status = "Completed" AND r.PayTime BETWEEN ? AND ? GROUP BY p.ProID;', [startTime, endTime], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
    connection.end();
});

app.post('/addTypeProduct', (req, res) => {
    const { TypeName } = req.body;
    console.log(TypeName);
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'myStore'
    });
    connection.connect();

    connection.query('INSERT INTO PRODUCT_TYPE (TypeName) VALUES (?)', [TypeName], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
    connection.end();
});

app.get('/TypeProduct', (req, res) => {
    // res.send('Hello World!!!');
    // res.json({ message: 'Hello World!!!' });
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'myStore'
    });
    
    connection.connect();
    connection.query('SELECT * FROM PRODUCT_TYPE', function (error, results, fields) {
        if (error) throw error;
            res.json(results);
    });
    connection.end();
});




app.listen(port, function() {
    console.log("Listening node.js on port " + port);
});
