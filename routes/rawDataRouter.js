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

rawDataRouter.post('/writeFile', async (req, res) => {
    try {
        if (req.files) {
          
          let sampleFile = req.files.file;
          let uploadpath = __dirname + '/upload/' + sampleFile.name;
          console.log("upload path is : ", uploadpath);
            console.log("file is : ", sampleFile);
            sampleFile.mv(uploadpath, function (err) {
              if (err) return res.status(500).send(err);
              console.log("File saved");  
            })  
          
          
          var sqlConn = await sql.connect(config)
          
            if (sqlConn) {
                var request = new sql.Request()
                    .input('fileName', sql.VarChar, sampleFile.name)
                    .input('data', sql.VarBinary, sampleFile.data)
                    .input('extension',sql.VarChar,sampleFile.mimetype)
                var query = `insert into files(fileName,data,extension) values (@fileName, @data,@extension)`
                
                var response = await request.query(query)
                
                if (response && response.rowsAffected == 1) {
                  console.log("Data saved successfully");  
                  res.send("Data saved successfully");
                } else {
                  console.log("Data not saved");  
                  res.send("Data not saved");
                }
            } else {
              console.log("Connection error");  
              res.send("connection error");
            }
        } else {
            console.log("File not present");
            res.send("file not found");
        }
    } catch (error) {
        console.log("error in file reading", error);
        res.send("Error in file sending");
    }
})

rawDataRouter.get('/readFile', async (req, res) => {
    try {
        let fileData={}
            var sqlConn = await sql.connect(config)
          
            if (sqlConn) {
                var request = new sql.Request()
                var query = `select * from files`
                var response = await request.query(query)
                if (response && response.recordset) {
                    console.log("response is : ", response.recordset);
                    fileData = response.recordset[0];

                    console.log("FileData is : ", fileData);
                    console.log("Data is : ", (fileData.data).toString());


                    res.send("Data found")
                } else {
                    res.send("Data could not found");
                }
            } else {
                res.send("conncetion error");
        }
        
    } catch (error) {
        console.log("error in file reading", error);
        res.send("Error in file reading");
    }
})

module.exports = {
    rawDataRouter
}