const express = require('express')
const cors = require("cors");
const logger = require("morgan");
const cron = require("node-cron");
var sql = require('mssql');


const {checkAndCreateTdyDataTbl, checkAndCreateNxtDayDataTbl } = require('./helpers/helpers');

const app = express()
const port = 8080
app.use(cors())
app.use(express.json())
app.use(logger("dev"));

const { userRouter } = require("./routes/userRouter");
const { rawDataRouter } = require("./routes/rawDataRouter");
const config = require('./dbConfig');
const { TablesName } = require('./constant');
const { convertFileToPlanText } = require('./helpers/dataTranscation');


app.use("/rawData", rawDataRouter);
app.use("/user", userRouter);

app.get('/', async (req, res) => {
    res.send("hello world")
})

app.post('/addFile',async(req,res) =>  {
  try {
    if (req.files) {
        
      let sampleFile = req.files.file;
      let uploadpath = __dirname + '/upload/' + sampleFile.name;
      console.log("upload path is : ", uploadpath);
      console.log("file is : ", sampleFile);
      sampleFile.mv(uploadpath, function (err) {
        if (err) return res.status(500).send(err);
        console.log("File saved");
        res.send("file saved");
      })
    }
  } 
       catch (error) {
      console.log("error in file reading", error);
      res.send("Error in file sending");
  }
})


cron.schedule("0 0 * * *", async() => {
  var res = await checkAndCreateTdyDataTbl(TablesName.FILE);
  if (res.error) {
    console.log("Error in creating today table")
  } else {
    console.log("Table created")
  }
  res = await checkAndCreateNxtDayDataTbl(TablesName.FILE);
  if (res.error) {
    console.log("Error in creating next day table")
  } else {
    console.log("Table created")
  }
});

// local time
cron.schedule("5 0 * * *", async() => {
  var res = await checkAndCreateTdyDataTbl(TablesName.DATA_TRANSACTION);
  if (res.error) {
    console.log("Error in creating today table")
  } else {
    console.log("Table created")
  }
  res = await checkAndCreateNxtDayDataTbl(TablesName.DATA_TRANSACTION);
  if (res.error) {
    console.log("Error in creating next day table")
  } else {
    console.log("Table created")
  }
});


cron.schedule("30 0 * * *", async() => {
  var res = await convertFileToPlanText();
  if (res.error) {
    console.log("Error in creating today table")
  } else {
    console.log("Table created")
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})