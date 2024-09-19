const con = require("./connect");

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE booking", function (err) {
    if (err) throw err;
    const sql = `CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            phone VARCHAR(10) NOT NULL, 
            password VARCHAR(100) NOT NULL
        )CREATE TABLE artist (
            id INT AUTO_INCREMENT PRIMARY KEY,
            phone VARCHAR(10) NOT NULL, 
            password VARCHAR(100) NOT NULL
        )`;
    con.query(sql, function (err) {
      if (err) throw err;
    });
  });
});
