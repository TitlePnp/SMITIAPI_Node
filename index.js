const express = require('express');
const cors = require('cors');
var mysql      = require('mysql');
const app = express();
var port = process.env.PORT || 7777;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


app.listen(port, function() {
    console.log("Listening node.js on port " + port);
});
