const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err);
        conn.query('SELECT * FROM heroku_1d21a32f34fbb8d.posts', (err, rows) => {
            if(err) return res.send(err);
            res.json(rows);
        })
    })
})

routes.post('/', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err);
        //console.log(req.body);
        conn.query('INSERT INTO heroku_1d21a32f34fbb8d.posts SET ?', [req.body], (err, rows) => {
            if(err) return res.send(err);
            res.send("New post recorded");
        })
    })
})

routes.delete('/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err);
        conn.query('DELETE FROM heroku_1d21a32f34fbb8d.posts WHERE id = ?', [req.params.id], (err, rows) => {
            if(err) return res.send(err);
            res.send("Post deleted");
        })
    })
})

routes.put('/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err);
        //console.log(req.body);
        conn.query('UPDATE heroku_1d21a32f34fbb8d.posts SET ? WHERE id = ?', [req.body, req.params.id], (err, rows) => {
            if(err) return res.send(err);
            res.send("Post updated");
        })
    })
})

module.exports = routes;