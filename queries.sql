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
    created_at DATETIMEOffset default GETDATE()
)