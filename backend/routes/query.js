const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

const dbConfig = {
	host: process.env.SINGLESTORE_HOST || 'localhost',
	user: process.env.SINGLESTORE_USER || 'root',
	password: process.env.SINGLESTORE_PASSWORD || '',
	database: process.env.SINGLESTORE_DB || 'reCapture',
  };

router.get('/', async (req, res) => {
    const {queryType, username } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
        'SELECT * FROM posts WHERE username = ? ORDER BY created_at DESC',
    [username]
  );
   await connection.end();

 res.json(result);
});

module.exports = router;