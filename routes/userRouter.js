const userRouter = require('express').Router();

var sql = require("mssql");
const config = require('../dbConfig')

userRouter.post('/create', async(req, res) => {
    var data = {error: false}
    try {
        var sqlConn = await sql.connect(config)
        console.log(req.body)
        if (sqlConn) {
            var request = new sql.Request()
                .input('about', sql.VarChar, req.body.about)
                .input('education', sql.VarChar, req.body.education)
                .input('occupation', sql.VarChar, req.body.occupation)
                .input('durables_used', sql.VarChar, req.body.durables_used)
            var query = `insert into users(about, education, occupation, durables_used) OUTPUT inserted.user_id values (@about, @education, @occupation, @durables_used)`
            var response = await request.query(query)
            // var id = response.recordset[0].user_id
            // var hash = (id*9*12*2022);
            if (response && response.rowsAffected == 1) {
                data['user_id'] = response.recordset[0].user_id
                data['message'] = "User registered successfully"
            } else {
                data['message'] = "User could not be registered"
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

userRouter.get('/getusers', async(req, res) => {
    var data = {error: false}
    try {
        var sqlConn = await sql.connect(config)
        if (sqlConn) {
            var request = new sql.Request();
            var query = `Select * from users`
            var response = await request.query(query)
            if (response && response.recordset) {
                data['data'] = response.recordset
            } else {
                data['message'] = "No data"
            }
        } else {
            data['error'] = true
            data['message'] = "Database connection error"
        }
        res.send(data)
    } catch (error) {
        console.log(error.message)
        data['error'] = true
        data['message'] = "Internal Error"
        res.status(500).send(data)
    }
})


module.exports = {
    userRouter
}