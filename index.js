const express = require('express')
const cors = require("cors");
const logger = require("morgan");
const cron = require("node-cron");
const { checkAndCreateTdyDataTranscTbl, checkAndCreateNxtDayDataTranscTbl } = require('./helpers/helpers');

const app = express()
const port = 8080

app.use(cors())
app.use(express.json())
app.use(logger("dev"));


const { userRouter } = require("./routes/userRouter");
const { rawDataRouter } = require("./routes/rawDataRouter");


app.use("/rawData", rawDataRouter);
app.use("/user", userRouter);

app.get('/', async(req, res) => {
  res.send("hello world")
})

// local time
cron.schedule("1 0 * * *", async() => {
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