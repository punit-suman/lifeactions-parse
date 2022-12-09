const amazonRouter = require('express').Router();
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const stringify = require('csv-stringify-as-promised');
const { amazonParser } = require('../parsers/amazon')

var sql = require("mssql");

// config for your database
var config = {
    server: 'localhost', 
    database: 'lifeActions',
    options: {
        trustServerCertificate: true,
        Encrypt: true,
    },
    pool:{
        max:10,
        min:0,
        idleTimeoutMillis:30000
    }
};

amazonRouter.get('/createcsv', async(req, res) => {
    try {
        const fileName = 'timeStamp4_2'
        const file = readline.createInterface({
            input: fs.createReadStream(path.join('C:','Users','Punit','Downloads', fileName + '.txt')),
            output: process.stdout,
            terminal: false
        });
        let csvData = []
        let lineArr = []
        file.on('line', (line) => {
            if (line.includes("-----")) {
                if (lineArr.length > 0) {
                    csvData.push(lineArr)
                }
                lineArr = []
            }
            let val = ''
            if (line.includes('-----') && line.includes('EventType')) {
                val = line.split(":")[1].trim()
                lineArr.push(val)
            } else if (line.startsWith('ClassName')) {
                val = line.substring(11)
                lineArr.push(val)
            } else if (line.startsWith('Class')) {
                val = line.substring(7)
                lineArr.push(val)
            } else if (line.startsWith('ContentDescription')) {
                val = line.substring(20)
                lineArr.push(val)
            } else if (line.startsWith('PackageName')) {
                val = line.substring(13)
                lineArr.push(val)
            } else if (line.startsWith('Text')) {
                val = line.substring(6)
                lineArr.push(val)
            } else if (line.startsWith('WindowId')) {
                val = line.substring(10)
                lineArr.push(val)
            } else if (line.startsWith('event time')) {
                val = line.substring(12)
                lineArr.push(val)
            } else {
                val = ''
            }
            console.log("--",val)
          }).on('close', async() => {
            columns = ['EventType', 'Class', 'ClassName', 'ContentDescription', 'PackageName', 'Text', 'WindowId', 'EventTime']
            const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
            const dirName = path.join(__dirname, 'temp-files')
            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName);
            }
            const filePath = path.join(dirName, fileName + '.csv')
            fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, {flag: 'w'});
            res.send("File created")
        });
    } catch (error) {
        console.log("Error (/amazon/createcsv): ", error.message)
    }
})

amazonRouter.get('/data',(req,res)=>{
    try{
        sql.connect(config, async function (err) {
            if (err) console.log(err);
            var request = new sql.Request();
            var query = `Select * from apps_m`
            var response = await request.query(query)
            response?.recordset.map((rec) =>{
                console.log(rec)
            })
        })
        const file = readline.createInterface({
            input: fs.createReadStream(path.join('C:','Users','Punit','Downloads','timeStamp18_41.txt')),
            output: process.stdout,
            terminal: false
        });
        file.on('line', (line) => {
            if (line.includes("-----")) {
                if (lineArr.length > 0) {
                    amazonParser(lineArr)
                }
                lineArr = []
            }
            if (line.includes('PackageName')) {
                // if (line.includes('amazon'))
            }
            lineArr.push(line)
            // if (line.includes(':')) {
            //   let val = line.split(":")[1].trim()
            //   if (line.includes('Event Type')) {
            //     eventType = val
            //   }
            //   if (line.includes('Data')) {
            //     data = val
            //   }
            //   if (line.includes('Event Time')) {
            //     eventTime = val
            //   }
            //   if (line.includes('Package')) {
            //     pkg = val
            //   }
            // } else if (line.includes('---')) {
            //   arr.push({eventTime, pkg, eventType, data})
            //   eventType = null
            //   data = null
            //   eventTime = null
            //   pkg = null
            // }
          }).on('close', async() => {
            // let csvData = []
            // columns = ['Time', 'Package', 'Event Type', 'Data']
            // arr.map(ap => {
            //     csvData.push([ap.eventTime, ap.pkg, ap.eventType, ap.data])
            // })
            // const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
            // const dirName = path.join(__dirname, 'temp-files')
            // if (!fs.existsSync(dirName)){
            //     fs.mkdirSync(dirName);
            // }
            // var fileName = "abcd.csv"
            // const filePath = path.join(dirName, fileName)
            // fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, {flag: 'w'});
        });
      let arr = []
      let eventType = null
      let data = null
      let eventTime = null
      let pkg = null

      let lineArr = []
      let i = 0
      file.on('line', (line) => {
        if (line.includes("-----")) {
            if (lineArr.length > 0) {
                amazonParser(lineArr)
            }
            lineArr = []
        }
        if (line.includes('PackageName')) {
            // if (line.includes('amazon'))
        }
        lineArr.push(line)
        // if (line.includes(':')) {
        //   let val = line.split(":")[1].trim()
        //   if (line.includes('Event Type')) {
        //     eventType = val
        //   }
        //   if (line.includes('Data')) {
        //     data = val
        //   }
        //   if (line.includes('Event Time')) {
        //     eventTime = val
        //   }
        //   if (line.includes('Package')) {
        //     pkg = val
        //   }
        // } else if (line.includes('---')) {
        //   arr.push({eventTime, pkg, eventType, data})
        //   eventType = null
        //   data = null
        //   eventTime = null
        //   pkg = null
        // }
      }).on('close', async() => {
        // let csvData = []
        // columns = ['Time', 'Package', 'Event Type', 'Data']
        // arr.map(ap => {
        //     csvData.push([ap.eventTime, ap.pkg, ap.eventType, ap.data])
        // })
        // const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
        // const dirName = path.join(__dirname, 'temp-files')
        // if (!fs.existsSync(dirName)){
        //     fs.mkdirSync(dirName);
        // }
        // var fileName = "abcd.csv"
        // const filePath = path.join(dirName, fileName)
        // fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, {flag: 'w'});
      });
    } catch(err){
      console.log(err.message)
    }
  })

  module.exports = {
    amazonRouter
  }