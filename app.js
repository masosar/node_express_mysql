const express = require("express");
//const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
//proxy
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

const API_SERVICE_URL = "https://node-ex-mysql.herokuapp.com";

const PORT = process.env.PORT || 3050;

const app = express();

//Logging
app.use(morgan('dev'));
//app.use(cors());
//app.use(cors({ origin: "http://marcososa.me", credentials: true }))
//app.use(cors({ origin: "*", credentials: true }))


//app.options('*', cors());

// Add Access Control Allow Origin headers
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested, Content-Type"
//   )
  
//       // intercept OPTIONS method
//       if (req.method === 'OPTIONS' ) {
//         res.header(
//           "Access-Control-Allow-Methods",
//           "POST, PUT, PATCH, GET, DELETE"
//         )
//         return res.status(200).json({})
//       }
//       next();
// });

app.use(bodyParser.json());

//mysql://b96a31a520074a:ea1fc685@us-cdbr-east-03.cleardb.com/heroku_1d21a32f34fbb8d
const connection = mysql.createPool({
  host: "us-cdbr-east-03.cleardb.com",
  user: "b96a31a520074a",
  password: "ea1fc685",
  database: "heroku_1d21a32f34fbb8d",
});
// const connection = mysql.createConnection({
//     host: 'us-cdbr-east-03.cleardb.com',
//     user: 'b96a31a520074a',
//     password: 'ea1fc685',
//     database: 'heroku_1d21a32f34fbb8d'
// });

//Create routes for the endpoints
app.get("/", (req, res, next) => {
  res.send("Welcome to my API");
});

// Info GET endpoint
app.get('/info', (req, res, next) => {
  res.send('This is a proxy service which proxies to Billing and Account APIs.');
});

// Authorization
app.use('', (req, res, next) => {
  if (req.headers.authorization) {
      next();
  } else {
      res.sendStatus(403);
  }
});

// Proxy endpoints
app.use('/node-ex-mysql', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/node-ex-mysql`]: '',
  },
}));







//endpoint "movies"
app.get("/movies", (req, res, next) => {
  const sql = "SELECT * FROM ghibli";

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send("No results");
    }
  });

  //res.send('List of Ghibli movies');
});

app.get("/movies/:id", (req, res, next) => {
  const { id } = req.params;
  const sql = `SELECT * FROM ghibli WHERE id = ${id}`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send("No results");
    }
  });
});

app.post("/add", (req, res, next) => {
  const sql = "INSERT INTO ghibli SET ?";
  const movieObj = {
    title: req.body.title,
    original_title: req.body.original_title,
    original_title_romanised: req.body.original_title_romanised,
    description: req.body.description,
    director: req.body.director,
    release_date: req.body.release_date,
  };

  connection.query(sql, movieObj, (error) => {
    if (error) throw error;
    res.send("Movie added");
  });
});

app.put("/update/:id", (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    original_title,
    original_title_romanised,
    description,
    director,
    release_date,
  } = req.body;
  const sql = `UPDATE ghibli SET title = '${title}' , original_title = '${original_title}', original_title_romanised = '${original_title_romanised}', description = '${description}', director = '${director}', release_date = '${release_date}' WHERE id = ${id}`;

  connection.query(sql, (error) => {
    if (error) throw error;
    res.send("Record updated");
  });
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM ghibli WHERE id = ${id}`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.send("Record deleted");
  });
});

// //Check connection
// connection.connect(error => {
//     if (error) throw error;
//     console.log('Database server running!')
// })

app.listen(PORT, () => console.log(`Server running in port ${PORT}`));
