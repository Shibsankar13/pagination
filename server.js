const express = require('express');
const mysql = require('mysql2');
const app = express();

app.set("view engine", "ejs");

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"Your Password",
    database: "sakila",
});

db.connect(err =>{
    if(err){
        console.error("Database connection failed",err);
    }
    else{
        console.log("Connected to mySql");
    }
});

app.get("/actors",(req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page -1) * limit;

    let sql = `SELECT * FROM actor LIMIT ? OFFSET ?`;
    let countSql = `SELECT COUNT(*) AS total FROM actor`;

    db.query(countSql, (err, countResult) => {
        if(err) return res.status(500).json({error: err.message});

        let totalActors = countResult[0].total;
        let totalPages = Math.ceil(totalActors / limit);

        db.query(sql, [limit, offset], (err, actors) => {
            if (err) return res.status(500).json({ error: err.message });
            res.render("actors", {
                actors,
                page,
                totalPages,
                limit,
              });
            });
          });
        });

        app.listen(3000, () => {
            console.log("Server running on http://localhost:3000");
          });
