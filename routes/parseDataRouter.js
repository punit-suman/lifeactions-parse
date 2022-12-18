// const parseDataRouter = require('express').Router();
var sql = require("mssql");
const config = require('../dbConfig')

const parseData = async() => {
    try {
        const today = new Date()
        const prevDay = new Date(today.setDate(today.getDate() - 1))
        var suffix = `${prevDay.getDate()}_${prevDay.getMonth()+1}_${prevDay.getFullYear()}`
        let tableName = `data_transaction_${suffix}`
        var sqlConn = await sql.connect(config)
        if (sqlConn) {
            let rawData = []
            var request = new sql.Request()
            var query = `select * from ${tableName}`
            var response = await request.query(query)
            if (response && response.recordset) {
                rawData = response.recordset
            }
            rawData.map((d) => {
                let str = d.data
                var eventIndex = str.indexOf('NewEvent')
                var infoIndex = str.indexOf('appInfo^')
                var textIndex = str.indexOf('text^')
                var descIndex = str.indexOf('description^')
                var timeIndex = str.indexOf('eventTime^')
                var nxtEventIndex = str.indexOf('NewEvent', eventIndex+1)
                // console.log(infoIndex, textIndex, descIndex, timeIndex, eventIndex, nxtEventIndex)
                // console.log(eventIndex)
                while(eventIndex != -1) {
                    eventIndex = nxtEventIndex
                    const info = str.substring(infoIndex+8, textIndex-1)
                    const text = str.substring(textIndex+5, descIndex-1)
                    const desc = str.substring(descIndex+12, timeIndex-1)
                    let time
                    if (nxtEventIndex != -1) {
                        time = str.substring(timeIndex+10, nxtEventIndex-1)
                    } else {
                        time = str.substring(timeIndex+10)
                    }
                    infoIndex = str.indexOf('appInfo^', infoIndex+1)
                    textIndex = str.indexOf('text^', textIndex+1)
                    descIndex = str.indexOf('description^', descIndex+1)
                    timeIndex = str.indexOf('eventTime^', timeIndex+1)
                    nxtEventIndex = str.indexOf('NewEvent', nxtEventIndex+1)
                    // console.log("--", infoIndex, textIndex, descIndex, timeIndex, eventIndex, nxtEventIndex)
                    // console.log({info, text: text != '[]' ? text : '', description: desc != 'null' ? desc : '', time: new Date(time)})
                }
            })
        }
    } catch(err) {
        console.log("parse error: ", err.message)
    }
}

module.exports = {
    parseData
}