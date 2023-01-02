const express = require('express')
const cors = require("cors");
const logger = require("morgan");
const cron = require("node-cron");
const {checkAndCreateTdyDataTbl, checkAndCreateNxtDayDataTbl } = require('./helpers/helpers');
const { parseData, createFinalDataCsv, decryptStr, encrypt } = require('./routes/parseDataRouter')
const { appLevelParse } = require('./routes/appLevelParseRouter')

const app = express()
const port = 8080
app.use(cors())
app.use(express.json())
app.use(logger("dev"));

const { userRouter } = require("./routes/userRouter");
const { rawDataRouter } = require("./routes/rawDataRouter");
const { parseDataRouter } = require("./routes/parseDataRouter");

// const config = require('./dbConfig');
const { TablesName } = require('./constant');
const { convertFileToPlanText } = require('./helpers/dataTranscation');


app.use("/rawData", rawDataRouter);
app.use("/parseData", parseDataRouter);
app.use("/user", userRouter);

app.get('/', async (req, res) => {
    res.send("hello world")
})

// app.post('/addFile',async(req,res) =>  {
//   try {
//     if (req.files) {
        
//       let sampleFile = req.files.file;
//       let uploadpath = __dirname + '/upload/' + sampleFile.name;
//       console.log("upload path is : ", uploadpath);
//       console.log("file is : ", sampleFile);
//       sampleFile.mv(uploadpath, function (err) {
//         if (err) return res.status(500).send(err);
//         console.log("File saved");
//         res.send("file saved");
//       })
//     }
//   } 
//        catch (error) {
//       console.log("error in file reading", error);
//       res.send("Error in file sending");
//   }
// })

const checkAndCreateTables = async(type) => {
  try {
    var res = await checkAndCreateTdyDataTbl(type);
    if (res.error) {
      console.log("Error in creating today table")
    } else {
      console.log("Today table created")
    }
    res = await checkAndCreateNxtDayDataTbl(type);
    if (res.error) {
      // console.log(res.message)
      console.log("Error in creating next day table")
    } else {
      console.log("Next day table created")
    }
  } catch(err) {
    console.log(err.message)
  }
}

cron.schedule("0 0 * * *", async() => {
  await checkAndCreateTables(TablesName.FILE)
  await checkAndCreateTables(TablesName.DATA_TRANSACTION)
  await checkAndCreateTables(TablesName.FINAL_DATA)
});


cron.schedule("15 0 * * *", async() => {
  var res = await convertFileToPlanText();
  if (res.error) {
    console.log("Error in converting data")
  } else {
    console.log("Table created")
  }
});

// parse raw data everyday
// cron.schedule("* 3 * * *", async() => {
//   await parseData()
// })

// parse raw data
cron.schedule("0 2 * * *", async() => {
  await parseData()
});

// create final data csv file
cron.schedule("0 6 * * *", async() => {
  await createFinalDataCsv()
});

// cron job test
cron.schedule("* * * * *", async() => {
  console.log('cron job running...')
});

app.get('/cftpt', async(req, res) => {
  await convertFileToPlanText();
  res.send("Done")
})

app.get('/pd', async(req, res) => {
  await parseData();
  res.send("Done")
})

app.get('/cfdc', async(req, res) => {
  await createFinalDataCsv();
  res.send("Done")
})

app.get('/run', async(req, res) => {
  // await convertFileToPlanText();
  // await parseData()
  // await createFinalDataCsv()
  // await checkAndCreateTables(TablesName.FILE)
  // await checkAndCreateTables(TablesName.DATA_TRANSACTION)
  // await checkAndCreateTables(TablesName.FINAL_DATA)
  // await decryptStr()
  // await encrypt()
  // let a = await appLevelParse()
  // res.send(a)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})