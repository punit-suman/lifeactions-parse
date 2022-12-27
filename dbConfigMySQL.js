var production = true

var mysql = require('mysql');

var config = production ? 
  mysql.createPool({
    host: "dev-lifeactions-db.ckzcfxihz4uf.ap-south-1.rds.amazonaws.com",
    user: "admin",
    password: "password123",
    database: "lifeactions",
    port: 3306
  })
: mysql.createPool({
  host: "localhost",
  user: "root",
  password: "punits",
  database: "lifeactions"
});

module.exports = {
    config
}