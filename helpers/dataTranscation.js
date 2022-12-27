const { TablesName } = require("../constant")
const { config } = require("../dbConfigMySQL")

async function convertFileToPlanText() {
    try {
        let Files;
        const today = new Date()
        const yesterday = new Date(today.setDate(today.getDate() - 1))
        var yesterdaySuffix = `${yesterday.getDate()}_${yesterday.getMonth() + 1}_${yesterday.getFullYear()}`
           
        let filesTableName = `${TablesName.FILE}_${yesterdaySuffix}`
        let dataTableName = `${TablesName.DATA_TRANSACTION}_${yesterdaySuffix}`
          
        var query = `select * from ${filesTableName}`
        config.query(query, function(err, result) {
            if (err) {
                console.log("Files not fetched");
            } else {
                Files = result
                // console.log("files fetched ", Files);
                let values = []
                if (Files.length > 0) {    
                    Files.forEach(item => values.push([
                        (item.data).toString(), item.user_id, item.id
                    ]));
                }
                var q = `insert into ${dataTableName}(data, user_id, file_id) values ?`;
                config.query(q, [values], function(err, result) {
                    if (err) {
                        console.log(err.message)
                    }
                    if (result && result.affectedRows > 0) {
                        console.log('Data inserted successfully')
                    }
                })
            }
        })
    } catch (error) {
        console.log("Error in convertFileToPlanText", error.message);
        return { error: true, message: 'Error occured in convertFileToPlanText'};
    }

} 

module.exports = {
    convertFileToPlanText
}