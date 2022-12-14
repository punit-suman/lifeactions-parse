const rawDataRouter = require('express').Router();
const stringify = require('csv-stringify-as-promised');
const path = require('path');
const fs = require('fs');
var sql = require("mssql");
const config = require('../dbConfig')

rawDataRouter.post('/add', async(req, res) => {
    var data = {error: false}
    try {
        
        const today = new Date()
        var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
        let tableName = `data_transaction_${tdyDaySuffix}`

        var sqlConn = await sql.connect(config)
        
        if (sqlConn) {
            var request = new sql.Request()
                .input('data', sql.VarChar, req.body.data)
                .input('user_id', sql.Int, parseInt(req.body.userid))
            
            var query = `insert into ${tableName}(data, user_id) OUTPUT inserted.id values (@data, @user_id)`
            
            var response = await request.query(query)
            
            if (response && response.rowsAffected == 1) {
                data['message'] = "Data stored successfully"
            } else {
                data['message'] = "Data could not be registered"
            }
        } else {
            data['error'] = true
            data['message'] = "Database connection error"
        }
        res.send(data)
    } catch (error) {
        console.log("req.body -- ", req.body)
        console.log("error.message -- ", error.message)
        data['error'] = true
        data['message'] = "Internal Error"
        res.status(500).send(data)
    }
})

rawDataRouter.get('/getData', async(req, res) => {
    var data = {error: false}
    try {
        var sqlConn = await sql.connect(config)
        if (sqlConn) {
            var request = new sql.Request()
            const today = new Date()
            var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
            let tableName = `data_transaction_${tdyDaySuffix}`
            var query = `select * from ${tableName}`
            var response = await request.query(query)
            if (response && response.recordset) {
                data['data'] = response.recordset
                data['message'] = "Data sent successfully"
            } else {
                data['message'] = "Data could not sent"
            }
        } else {
            data['error'] = true
            data['message'] = "Database connection error"
        }
        res.send(data)
    } catch (error) {
        console.log("req.body -- ", req.body)
        console.log("error.message -- ", error.message)
        data['error'] = true
        data['message'] = "Internal Error"
        res.status(500).send(data)
    }
})

rawDataRouter.get('/getcsv/:date', async(req, res) => {
    var data = {error: false}
    try {
        var sqlConn = await sql.connect(config)
        if (sqlConn) {
            var request = new sql.Request()
            var date = req.params.date
            var daySuffix
            if (!date) {
                const today = new Date()
                daySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
            } else {
                daySuffix = date
            }
            let tableName = `data_transaction_${daySuffix}`
            var query = `select * from ${tableName}`
            var response = await request.query(query)
            if (response && response.recordset) {
                let csvData = []
                columns = ['Id', 'Data', 'UserId', 'CreatedAt']
                response.recordset.map(ap => {
                    csvData.push([ap.id, ap.data, ap.user_id, (new Date(ap.created_at)).toString()])
                })
                const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
                const dirName = path.join(__dirname, 'temp-files')
                if (!fs.existsSync(dirName)){
                    fs.mkdirSync(dirName);
                }
                const filePath = path.join(dirName, tableName + '.csv')
                fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, {flag: 'w'});
                res.download(filePath, () => {
                    fs.unlink(filePath, (err) => {
                        if (err) throw err;
                    });
                });
                return
                // data['data'] = response.recordset
                // data['message'] = "Data sent successfully"
            } else {
                data['message'] = "Data could not sent"
            }
        } else {
            data['error'] = true
            data['message'] = "Database connection error"
        }
        res.send(data)
    } catch (error) {
        console.log("req.body -- ", req.body)
        console.log("error.message -- ", error.message)
        data['error'] = true
        data['message'] = "Internal Error"
        res.status(500).send(data)
    }
})

module.exports = {
    rawDataRouter
}