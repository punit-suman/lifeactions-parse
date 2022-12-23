const rawDataRouter = require('express').Router();
const stringify = require('csv-stringify-as-promised');
const path = require('path');
const fs = require('fs');
const { sql, config } = require('../dbConfig')
const multer = require('multer');
const { TablesName } = require('../constant');

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
    try {
        var date = req.params.date
        var daySuffix
        if (!date) {
            const today = new Date()
            daySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
        } else {
            daySuffix = date
        }
        let tableName = `data_transaction_${daySuffix}`
        const dirName = path.join(__dirname, 'temp-files')
        const filePath = path.join(dirName, tableName + '.csv')
        res.download(filePath, () => {
            fs.unlink(filePath, (err) => {
                if (err) res.send(err.message);
            });
        });
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
})

rawDataRouter.get('/createcsv/:date', async (req, res) => {
    var data = { error: false }
    try {
        var sqlConn = await sql.connect(config)
        if (sqlConn) {
            var request = new sql.Request()
            var date = req.params.date
            var daySuffix
            if (!date) {
                const today = new Date()
                daySuffix = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`
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
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName);
                }
                const filePath = path.join(dirName, tableName + '.csv')
                fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, { flag: 'w' });
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

rawDataRouter.post('/writeFile', multer().single('file') ,async (req, res) => {
    try {
        // console.log("request is--------- : ", req);
        // console.log("request file is : ", req.file);
        // console.log("requst body is------ : ",req.body);
        // console.log("requst header userid------ : ",req.headers.userid);
    var data = {error: false}
    const today = new Date()
    var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
    let tableName = `${TablesName.FILE}_${tdyDaySuffix}`
        if (req.file) {
          
            let sampleFile = req.file;
            let userId = req.headers.userid;
          
          var sqlConn = await sql.connect(config)

            if (sqlConn) {
                var request = new sql.Request()
                    .input('fileName', sql.VarChar, sampleFile.originalname)
                    .input('data', sql.VarBinary, sampleFile.buffer)
                    .input('type', sql.VarChar, sampleFile.mimetype)
                    .input('userId', sql.Int, userId);
                var query = `insert into ${tableName}(file_name, data, type, user_id) values (@fileName, @data, @type, @userId)`
                var response = await request.query(query)
                
                if (response && response.rowsAffected == 1) {
                  console.log("Data saved successfully");  
                  data['message'] = "Data stored successfully"
                } else {
                  console.log("Data not saved");  
                  data['message'] = "Data could not be registered"
                }
            } else {
              console.log("Connection error");  
              data['error'] = true
            data['message'] = "Database connection error"
            }
        } else {
            console.log("File not present");
            data['error'] = true
            data['message'] = "Request without File";
        }
        res.send(data);
    } catch (error) {
        console.log("req.body -- ", req.body)
        console.log("error.message -- ", error.message)
        data['error'] = true
        data['message'] = "Internal Error"
        res.status(500).send(data)
    }
})

rawDataRouter.get('/readFile', async (req, res) => {
    try {
        var data = {error: false}
        let fileData = {}
        const today = new Date()
        var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
        let tableName = `${TablesName.FILE}_${tdyDaySuffix}`
            var sqlConn = await sql.connect(config)
          
            if (sqlConn) {
                var request = new sql.Request()
                var query = `select * from ${tableName}`
                var response = await request.query(query)
                if (response && response.recordset) {
                    console.log("response is : ", response.recordset);
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

module.exports = {
    rawDataRouter
}