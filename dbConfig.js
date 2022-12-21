var config = {
    server: 'lifeactions-db.ckzcfxihz4uf.ap-south-1.rds.amazonaws.com', 
    database: 'lifeactions',
    user: 'admin',
    password: 'pass1234',
    port: 1433,
    options: {
        trustServerCertificate: true,
        Encrypt: true,
    },
    pool:{
        max:10,
        min:0,
        idleTimeoutMillis:30000
    },
    requestTimeout: 300000
};

module.exports = config