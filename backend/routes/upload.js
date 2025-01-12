const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');

const router = express.Router();

const dbConfig = {
	host: process.env.SINGLESTORE_HOST || 'svc-e32004ae-311d-4cb8-8d6d-d518f04517c3-dml.aws-oregon-3.svc.singlestore.com',
	user: 'admin',
	password: 'YyLePz2SvDgFttiSKXyVBylQK4VwfBXB',
	database: 'recapture',
    port : '3306'
  };


router.post('/', async (req,res) => {
    const merged = req.body.image
    const name = uuidv4();
    const decoded = Buffer.from(merged, "base64");

    console.log("original: " + merged.length);

    console.log("decoded: " + decoded.length);

    const lat = req.body.lat;
    const lon = req.body.lon;
    const username = req.body.username;
    const caption = req.body.caption;
    if (!decoded) return res.sendStatus(400);
    const path = name + '.jpeg';
    fs.writeFileSync(path, decoded);

	const connection = await mysql.createConnection(dbConfig);
    let sql = "CREATE TABLE posts (username VARCHAR(255), image_path VARCHAR(255), caption VARCHAR(255), lat VARCHAR (255) , lon VARCHAR(255))"; 
    //connection.query(sql);
    //let sql = "DROP TABLE posts";
    //connection.query(sql);
    sql = `INSERT INTO posts (username, image_path, caption, lat, lon) VALUES ('${username}', '${path}', '${caption}', '${lat}', '${lon}')`;

    connection.query(sql);
	await connection.end()
    res.sendStatus(200);
});
module.exports = router;
