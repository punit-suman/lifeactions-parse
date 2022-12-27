const rawDataRouter = require('express').Router();
const stringify = require('csv-stringify-as-promised');
const path = require('path');
const fs = require('fs');
// const { sql, config } = require('../dbConfig')
const { config } = require('../dbConfigMySQL')
const multer = require('multer');
const { TablesName } = require('../constant');

rawDataRouter.post('/add', async(req, res) => {
    var data = {error: false}
    try {
        const today = new Date()
        var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
        let tableName = `data_transaction_${tdyDaySuffix}`

        var query = `insert into ${tableName}(data, user_id) values ?`;
        let values = [
            [req.body.data, req.body.userid]
        ]
        config.query(query, [values], function(err, result) {
            if (err) {
                data['error'] = true
                data['message'] = err.message
                res.status(500).send(data)
            }
            if (result && result.affectedRows > 0) {
                data['error'] = false
                data['message'] = "Data inserted"
                res.status(200).send(data)
            }
        })
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
        const today = new Date()
        var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
        let tableName = `data_transaction_${tdyDaySuffix}`
        
        var query = `select * from ${tableName}`;

        config.query(query, function(err, result) {
            if (err) {
                data['error'] = true
                data['message'] = err.message
                res.status(500).send(data)
            }
            if (result) {
                console.log(result)
                data['error'] = false
                data['data'] = result
                res.status(200).send(data)
            }
        })
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
        var date = req.params.date
            var daySuffix
            if (!date) {
                const today = new Date()
                daySuffix = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`
            } else {
                daySuffix = date
            }
        let tableName = `data_transaction_${daySuffix}`

        var query = `select * from ${tableName}`;

        config.query(query, async function(err, result) {
            if (err) {
                data['error'] = true
                data['message'] = err.message
                res.status(500).send(data)
            }
            if (result) {
                data['error'] = false
                data['data'] = result
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
                res.status(200).send(data)
            }
        })
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
            if (!userId) {
                userId = 0
            }
            var query = `insert into ${tableName}(file_name, data, type, user_id) values ?`;
            let values = [
                [sampleFile.originalname, sampleFile.buffer, sampleFile.mimetype, userId]
            ]
            config.query(query, [values], function(err, result) {
                if (err) {
                    data['error'] = true
                    data['message'] = err.message
                    console.log(err.message)
                    res.status(500).send(data)
                }
                if (result && result.affectedRows > 0) {
                    data['error'] = false
                    data['message'] = "Data inserted"
                    res.status(200).send(data)
                }
            })
        } else {
            console.log("File not present");
            data['error'] = true
            data['message'] = "Request without File";
            res.status(400).send(data);
        }
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
        
        var query = `select * from ${tableName}`;
        config.query(query, function(err, result) {
            if (err) {
                data['error'] = true
                data['message'] = err.message
                res.status(500).send(data)
            }
            if (result) {
                console.log(result)
                data['error'] = false
                data['data'] = result
                res.status(200).send(data)
            }
        })
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