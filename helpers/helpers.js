var sql = require("mssql");
const { TablesName } = require("../constant");
const config = require('../dbConfig');
const TableQueries = require("../TableQueries");

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

const createNewTable = async (tableName, type) => {
    console.log("In create new table : ", tableName, "  type is : ", type);
    var data = {error: false}
    try {
        var sqlConn = await sql.connect(config)
        if (sqlConn) {
            var request = new sql.Request()
                .input('tableName', sql.VarChar, tableName)
            var query;
            switch (type) {
                case TablesName.DATA_TRANSACTION:
                            query = TableQueries.data_transaction(tableName);               
                            break;
                case TablesName.FILE:
                            query = TableQueries.file(tableName);
                            break;
                case TablesName.FINAL_DATA:
                            query = TableQueries.final_data(tableName);
                            break;
                default: query = null;
                    break;
            }
            if (query) {
                var response = await request.query(query)
                console.log(response)
            } else {
                console.log("Unable to set query for table creation");
            }
        }
    } catch(error) {
        console.log("error.message -- ", error.message)
        data['error'] = true
        data['message'] = "Internal Error"
    }
    
}

const checkAndCreateTdyDataTbl = async(type) => {
    var response = {error: false, tblCreated: false}
    try {
        // create data transaction table for today if not exist
        const today = new Date()
        var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
        let tableName = `${type}_${tdyDaySuffix}`
        var isTbl = await checkTable(tableName)
        if (!isTbl.error) {
            if (!isTbl.tableFound) {
                await createNewTable(tableName,type);
                response.tblCreated = true
            } else if (isTbl.tableFound) {
                console.log('Table with same name found of type ', type);
                response['message'] = `Table with same name found of type ${type}`
            }
        } else {
            console.log("Error in checkAndCreateTdyDataTbl isTbl : ", isTbl.errorMessage)
            response.error = true
        }
        return response
      } catch(err) {
        console.log("Error in checkAndCreateTdyDataTbl : ", err.message)
        response.error = true
        return response
      }
}

const checkAndCreateNxtDayDataTbl = async(type) => {
    var response = {error: false, tblCreated: false}
    try {
        // create data transaction table for next day if not exist
        const today = new Date()
        const nextDay = new Date(today.setDate(today.getDate() + 1))
        var nxtDaySuffix = `${nextDay.getDate()}_${nextDay.getMonth()+1}_${nextDay.getFullYear()}`
        let tableName = `${type}_${nxtDaySuffix}`
        isTbl = await checkTable(tableName)
        if (!isTbl.error) {
            if (!isTbl.tableFound) {
                await createNewTable(tableName,type);
                response.tblCreated = true
            } else if (isTbl.tableFound) {
                console.log('Table with same name found of type ', type);
                response['message'] = `Table with same name found of type ${type}`
            }
        } else {
            console.log("Error in checkAndCreateNxtDayDataTbl isTbl : ", isTbl.errorMessage)
            response.error = true
        }
        return response
    } catch(err) {
        console.log("Error in checkAndCreateNxtDayDataTbl : ", err.message)
        response.error = true
        return response
    }
}
module.exports = {
    checkAndCreateTdyDataTbl,
    checkAndCreateNxtDayDataTbl,
    createNewTable,
    checkTable
}