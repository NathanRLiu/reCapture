const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

const dbConfig = {
	host: process.env.SINGLESTORE_HOST || 'localhost',
	user: process.env.SINGLESTORE_USER || 'root',
	password: process.env.SINGLESTORE_PASSWORD || '',
	database: process.env.SINGLESTORE_DB || 'reCapture',
  };

router.get('/', await (req, res) => {
    const {queryType, username } = req.body;

    let params;
    const sql = 'SELECT * FROM posts WHERE username = ? ORDER BY created_at DESC';
    


    const [result] = await connection.execute(sql, params);
    await connection.end();








    
    