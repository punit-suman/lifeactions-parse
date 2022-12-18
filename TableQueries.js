

function data_transaction(tableName) {
    
    return `Create table ${tableName} (
        id int IDENTITY(1,1) PRIMARY KEY,
        data varchar(max),
        user_id int,
        file_id int,
        created_at DATETIMEOffset default GETDATE()
    )`

}

function file(tableName) {
    return `CREATE TABLE ${tableName} (
        id int IDENTITY(1,1) PRIMARY KEY,
        file_name varchar(max),
        data varbinary(max),
        type varchar(255),
        user_id int ,
        created_at DATETIMEOffset default GETDATE()
    )`
}

module.exports = { data_transaction, file };