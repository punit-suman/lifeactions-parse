const express = require('express')
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const logger = require("morgan");
const stringify = require('csv-stringify-as-promised');

const app = express()
const port = 8080

app.use(cors())
app.use(express.json())
app.use(logger("dev"));

const { amazonRouter } = require("./routes/amazon");
const { userRouter } = require("./routes/userRouter");
const { rawDataRouter } = require("./routes/rawDataRouter");

const resultData=[]

app.use("/amazon", amazonRouter);
app.use("/rawData", rawDataRouter);
app.use("/user", userRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/data',(req,res)=>{
    
  try{
    const file = readline.createInterface({
        input: fs.createReadStream(path.join('C:','Users','Punit','Downloads','timeStamp6_32.txt')),
        output: process.stdout,
        terminal: false
    });

    let arr = []
    let eventType = null
    let data = null
    let eventTime = null
    let pkg = null
    file.on('line', (line) => {
      if (line.includes(':')) {
        let val = line.split(":")[1].trim()
        if (line.includes('Event Type')) {
          eventType = val
        }
        if (line.includes('Data')) {
          data = val
        }
        if (line.includes('Event Time')) {
          eventTime = val
        }
        if (line.includes('Package')) {
          pkg = val
        }
      } else if (line.includes('---')) {
        arr.push({eventTime, pkg, eventType, data})
        eventType = null
        data = null
        eventTime = null
        pkg = null
      }
    }).on('close', async() => {
      let csvData = []
      columns = ['Time', 'Package', 'Event Type', 'Data']
      arr.map(ap => {
          csvData.push([ap.eventTime, ap.pkg, ap.eventType, ap.data])
      })
      const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
      const dirName = path.join(__dirname, 'temp-files')
      if (!fs.existsSync(dirName)){
          fs.mkdirSync(dirName);
      }
      var fileName = "abcd.csv"
      const filePath = path.join(dirName, fileName)
      fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, {flag: 'w'});
    });
  } catch(err){
    console.log(err.message)
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})