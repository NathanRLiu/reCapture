const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

const dbConfig = {
	host: process.env.SINGLESTORE_HOST || 'svc-e32004ae-311d-4cb8-8d6d-d518f04517c3-dml.aws-oregon-3.svc.singlestore.com',
	user: 'admin',
	password: 'YyLePz2SvDgFttiSKXyVBylQK4VwfBXB',
	database: 'recapture',
    port : '3306'
  };

router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
        'SELECT * FROM posts'
  );
  console.log(result);
  res.json(result);
  await connection.end();
});

router.get('/byuser', async (req, res) => {
    const {queryType, username } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
        'SELECT * FROM posts WHERE username = ?',
    [username]
  );

  res.json(result);
  await connection.end();
});

module.exports = router;