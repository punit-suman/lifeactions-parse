const rawDataRouter = require('express').Router();

var sql = require("mssql");
const config = require('../dbConfig')

rawDataRouter.post('/add', async(req, res) => {
    var data = {error: false}
    try {
        var sqlConn = await sql.connect(config)
        if (sqlConn) {
            var request = new sql.Request()
                .input('data', sql.VarChar, req.body.data)
            var query = `insert into data_transaction(data) OUTPUT inserted.id values (@data)`
            var response = await request.query(query)
            var id = response.recordset[0].id
            // var hash = (id*9*12*2022);
            if (response && response.rowsAffected == 1) {
                // data['data'] = hash
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

module.exports = {
    rawDataRouter
}