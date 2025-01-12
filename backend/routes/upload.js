const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const router = express.Router();

const dbConfig = {
	host: process.env.SINGLESTORE_HOST || 'localhost',
	user: process.env.SINGLESTORE_USER || 'root',
	password: process.env.SINGLESTORE_PASSWORD || '',
	database: process.env.SINGLESTORE_DB || 'reCapture',
  };


router.post('/', async (req,res) => {

    const { image } = req.files;
    const username = req.username;
    if (!image) return res.sendStatus(400);
    const path = __dirname + '../img/' + image.name;
    image.mv(path);

	const connection = await mysql.createConnection(DbConfig);

    const sql = `INSERT INTO posts (username, image_path) VALUES ('${username}', '${path}')`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted"); 
    });
	await connection.end()
	
});
module.exports = router;
