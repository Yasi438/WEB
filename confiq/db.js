const mysql=require('mysql2/promise');

// database connection creationg

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'webproject',
    waitForConnections:true,
    connectionLimit: 10,
    queueLimit:0, 
})
module.exports=pool;