const express = require("express");
const app = express();
const mysql = require("mysql");
const myconn = require('express-myconnection');
const cors = require('cors');

const routes = require('./routes');

const PORT = process.env.PORT || 3060;

const dbOptions = {
    host: 'us-cdbr-east-03.cleardb.com',
    port: 3306,
    user: 'b96a31a520074a',
    password: 'ea1fc685',
    database: 'heroku_1d21a32f34fbb8d'
}

// 2. middleware ----------------------------------------------

app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json());
app.use(cors());

// 1. endpoints ----------------------------------------------
app.get('/', (req, res) => {
    res.send('Hello my world!');
})

app.use('/posts', routes);

app.listen(PORT, () => console.log(`Server running in port ${PORT}`));