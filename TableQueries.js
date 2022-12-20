

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

function final_data(tableName) {
    
    return `create table ${tableName} (
        id int IDENTITY(1,1) PRIMARY KEY,
        data_transaction_id int,
        user_id int,
        category_id int,
        app_id int,
        pattern_id int,
        event_info varchar(max),
        package_name varchar(max),
        data_text varchar(max),
        data_description varchar(max),
        event_time DATETIMEOFFSET,
        created_at DATETIMEOFFSET default GETDATE()
    )`

}

module.exports = { data_transaction, file, final_data };