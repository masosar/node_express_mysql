const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();
app.use(bodyParser.json());

//mySql

//mysql://b96a31a520074a:ea1fc685@us-cdbr-east-03.cleardb.com/heroku_1d21a32f34fbb8d
const connection = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b96a31a520074a',
    password: 'ea1fc685',
    database: 'heroku_1d21a32f34fbb8d'
});



//Create routes for the endpoints 
app.get('/', (req, res) => {
    res.send('Welcome to my API');
})

//endpoint "movies"
app.get('/movies', (req, res) => {
    const sql = 'SELECT * FROM ghibli';
    
    connection.query(sql, (error, results) => {
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        }else{
            res.send('No results');
        }
    });

    //res.send('List of Ghibli movies');
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM ghibli WHERE id = ${id}`;
    connection.query(sql, (error, results) => {
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        }else{
            res.send('No results');
        }
    });
})

app.post('/add', (req, res) => {
    
    const sql = 'INSERT INTO ghibli SET ?';
    const movieObj = {
        title: req.body.title,
        original_title: req.body.original_title,
        original_title_romanised:  req.body.original_title_romanised,
        description:  req.body.description,
        director:  req.body.director,
        release_date:  req.body.release_date
    }

    connection.query(sql, movieObj, error => {
        if(error) throw error;
        res.send('Movie added');
    });
});

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { title, 
            original_title,
            original_title_romanised,
            description,
            director,
            release_date
        } = req.body;
    const sql = `UPDATE ghibli SET title = '${title}' , original_title = '${original_title}', original_title_romanised = '${original_title_romanised}', description = '${description}', director = '${director}', release_date = '${release_date}' WHERE id = ${id}`;

    connection.query(sql, error => {
        if(error) throw error;
        res.send('Record updated');
    });
});

app.delete('/delete/:id', (req,res) => {
    const { id } = req.params;
    const sql = `DELETE FROM ghibli WHERE id = ${id}`;
    connection.query(sql, (error, results) => {
        if(error) throw error;
        res.send('Record deleted');
    });
})

//Check connection
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running!')
})

app.listen(PORT, ()=> console.log(`Server running in port ${PORT}`));