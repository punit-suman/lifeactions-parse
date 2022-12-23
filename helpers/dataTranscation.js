const { TablesName } = require("../constant")
const { sql, config } = require('../dbConfig');
const { decryptStr } = require("../routes/parseDataRouter");

async function convertFileToPlanText() {
    try {
        var sqlConn = await sql.connect(config)

        if (sqlConn) {
            var request = new sql.Request()
            let Files;
            const today = new Date()
           const yesterday = new Date(today.setDate(today.getDate() - 1))
            var yesterdaySuffix = `${yesterday.getDate()}_${yesterday.getMonth() + 1}_${yesterday.getFullYear()}`
           
            let filesTableName = `${TablesName.FILE}_${yesterdaySuffix}`
            let dataTableName = `${TablesName.DATA_TRANSACTION}_${yesterdaySuffix}`
          
            var query = `select * from ${filesTableName}`
            var response = await request.query(query)

            if (response && response.recordset) {
                Files = response.recordset
                console.log("files fetched ", Files);
            } else {
                console.log("Files not fetched");
                return { error: true, message: 'files could not fetched' };
            }

            if (Files.length > 0) {
                const table = new sql.Table(dataTableName);
                table.create = false;
                table.columns.add('data',sql.VarChar(sql.MAX),{ nullable: true })
                table.columns.add('user_id',sql.Int,{ nullable: true })
                table.columns.add('file_id',sql.Int,{ nullable: true })
                
                // for (let i = 0; i < Files.length; i++) {
                //     let item = Files[i]
                //     console.log("data - ", (item.data).toString())
                //     await decryptStr((item.data).toString())
                // }
                // return
                Files.forEach(item => table.rows.add((item.data).toString(), item.user_id, item.id));
            
                const results = await request.bulk(table);

                if (results.rowsAffected) {
                    console.log(`number of rows affected ${results.rowsAffected}`);
                    return { error: false, message: 'Data added' };

                } else {
                    console.log("Unable to add data");
                    return { error: true, message: 'unable to add data' };
                }

            } else {
                return { error: false, message: 'No file present in Files array' };
            }

        } else {
            console.log(" server connection failed");
            return { error: true, message: 'server connection failed'};
        }
    } catch (error) {
        console.log("Error in convertFileToPlanText", error.message);
        return { error: true, message: 'Error occured in convertFileToPlanText'};
    }

} 

module.exports = {
    convertFileToPlanText
}