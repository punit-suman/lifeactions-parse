var sql = require("mssql");
const config = require('../dbConfig')

const checkTable = async(tableName) => {
    var data = {error: false}
    var sqlConn = await sql.connect(config)
    if (sqlConn) {
        var request = new sql.Request()
            .input('tableName', sql.VarChar, tableName)
        var query = `SELECT * 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = 'dbo' 
            AND  TABLE_NAME = @tableName`
        var response = await request.query(query)
        // console.log(response)
        if (response.recordset.length > 0) {
            data['tableFound'] = true
        } else {
            data['tableFound'] = false
        }
        return data
    } else {
        data['error'] = true
        data['errorMessage'] = "Database connection error"
        return data
    }
}

const createNewDataTranscTbl = async(tableName) => {
    var data = {error: false}
    try {
        var sqlConn = await sql.connect(config)
        if (sqlConn) {
            var request = new sql.Request()
                .input('tableName', sql.VarChar, tableName)
            var query = `Create table ${tableName} (
                id int IDENTITY(1,1) PRIMARY KEY,
                data varchar(max),
                user_id int,
                created_at DATETIMEOffset default GETDATE()
            )`
            var response = await request.query(query)
            console.log(response)
        }
    } catch(error) {
        console.log("error.message -- ", error.message)
        data['error'] = true
        data['message'] = "Internal Error"
    }
    
}

const checkAndCreateTdyDataTranscTbl = async() => {
    var response = {error: false, tblCreated: false}
    try {
        // create data transaction table for today if not exist
        const today = new Date()
        var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
        let tableName = `data_transaction_${tdyDaySuffix}`
        var isTbl = await checkTable(tableName)
        if (!isTbl.error) {
            if (!isTbl.tableFound) {
                await createNewDataTranscTbl(tableName);
                response.tblCreated = true
            } else if (isTbl.tableFound) {
                console.log('Table with same name found')
                response['message'] = 'Table with same name found'
            }
        } else {
            console.log(isTbl.errorMessage)
            response.error = true
        }
        return response
      } catch(err) {
        console.log(err.message)
        response.error = true
        return response
      }
}

const checkAndCreateNxtDayDataTranscTbl = async() => {
    var response = {error: false, tblCreated: false}
    try {
        // create data transaction table for next day if not exist
        const nextDay = new Date(today.setDate(today.getDate() + 1))
        var nxtDaySuffix = `${nextDay.getDate()}_${nextDay.getMonth()+1}_${nextDay.getFullYear()}`
        tableName = `data_transaction_${nxtDaySuffix}`
        isTbl = await checkTable(tableName)
        if (!isTbl.error) {
            if (!isTbl.tableFound) {
                await createNewDataTranscTbl(tableName);
                response.tblCreated = true
            } else if (isTbl.tableFound) {
                console.log('Table with same name found')
                response['message'] = 'Table with same name found'
            }
        } else {
            console.log(isTbl.errorMessage)
            response.error = true
        }
        return response
    } catch(err) {
        console.log(err.message)
        response.error = true
        return response
    }
}

module.exports = {
    checkTable,
    createNewDataTranscTbl,
    checkAndCreateTdyDataTranscTbl,
    checkAndCreateNxtDayDataTranscTbl
}