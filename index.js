const express = require('express')
const cors = require("cors");
const logger = require("morgan");
const cron = require("node-cron");
const upload = require('express-fileupload');
var sql = require('mssql');
const { checkAndCreateTdyDataTranscTbl, checkAndCreateNxtDayDataTranscTbl } = require('./helpers/helpers');

const app = express()
const port = 8080

app.use(cors())
app.use(express.json())
app.use(logger("dev"));
app.use(upload());

const { userRouter } = require("./routes/userRouter");
const { rawDataRouter } = require("./routes/rawDataRouter");
const config = require('./dbConfig');


app.use("/rawData", rawDataRouter);
app.use("/user", userRouter);

app.get('/', async(req, res) => {
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


// local time
cron.schedule("1 * * * *", async() => {
  var res = await checkAndCreateTdyDataTranscTbl()
  if (res.error) {
    console.log("Error in creating today table")
  } else {
    console.log("Table created")
  }
  res = await checkAndCreateNxtDayDataTranscTbl()
  if (res.error) {
    console.log("Error in creating next day table")
  } else {
    console.log("Table created")
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})