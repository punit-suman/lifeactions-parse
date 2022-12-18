CREATE TABLE users (
    user_id int IDENTITY(1,1) PRIMARY KEY,
    about varchar(max),
    education varchar(255),
    occupation varchar(255),
    durables_used varchar(max),
	created_at DATETIMEOffset default GETDATE()
);

Create table data_transaction (
    id int IDENTITY(1,1) PRIMARY KEY,
    data varchar(max),
    user_id int,
    file_id int,
    created_at DATETIMEOffset default GETDATE()
)

CREATE TABLE files (
    id int IDENTITY(1,1) PRIMARY KEY,
    file_name varchar(max),
    data varbinary(max),
    type varchar(255),
	user_id int ,
	created_at DATETIMEOffset default GETDATE()
);

create table apps_m (
	app_id int IDENTITY(1,1) PRIMARY KEY,
    app_name varchar(255),
	description varchar(max),
	category_id int,
	packageName varchar(255),
    created_at DATETIMEOffset default GETDATE(),
	created_by int default 1,
	modified_at datetimeoffset,
	modified_by int,
	status varchar default 'active'
)
