require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { query } = require('./helpers/db.js');



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const port = process.env.PORT;


const openDb = () => {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,

    });
    return pool;
}

app.get('/', async (req, res) => {
    console.log(query)
    try {

        const result = await query('SELECT * FROM task');
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);

    } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({error: error});
    }
});
app.post('/new', async (req, res) => {

    try {

        const result = await query('INSERT INTO task (description) VALUES ($1) RETURNING *', 
        [req.body.description]);
        res.status(200).json({id: result.rows[0].id})


    } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({error: error});
    }
});

app.delete('/delete/:id', async(req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await query('DELETE FROM task WHERE id = $1', 
        [id]);
        res.status(200).json({id: id});
    } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({error: error});
    }
});

app.listen(port);