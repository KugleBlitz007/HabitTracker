// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();  // Add this line to load environment variables

// Create an Express application
const app = express();

// Use middleware
app.use(bodyParser.json());
app.use(cors());

// Configure PostgreSQL client
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST, 
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Define routes for habits
app.get('/habits', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM habits ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/habits', async (req, res) => {
  const { id, progress, level } = req.body;
  try {
    await pool.query('UPDATE habits SET progress = $1, level = $2 WHERE id = $3', [progress, level, id]);
    res.send('Habit updated');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Define routes for timetable
app.get('/timetable', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM timetable ORDER BY id');
      const timetable = {};
      result.rows.forEach(row => {
        timetable[row.id] = {
          time: row.time,
          activity: row.activity,
          details: row.details
        };
      });
      res.json(timetable);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  app.put('/timetable', async (req, res) => {
    const timetable = req.body;
    try {
      for (const [key, value] of Object.entries(timetable)) {
        await pool.query(
          `INSERT INTO timetable (id, time, activity, details)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id)
           DO UPDATE SET time = EXCLUDED.time, activity = EXCLUDED.activity, details = EXCLUDED.details`,
          [key, value.time, value.activity, value.details || '']
        );
      }
      res.send('Timetable updated');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


  // Define routes for quotes
app.get('/quotes', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM quotes ORDER BY id');
      const quotes = {};
      result.rows.forEach(row => {
        quotes[`quote-${row.id}`] = {
          text: row.text,
          author: row.author
        };
      });
      res.json(quotes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  app.put('/quotes', async (req, res) => {
    const quotes = req.body;
    try {
      for (const [key, value] of Object.entries(quotes)) {
        const id = parseInt(key.split('-')[1]);
        await pool.query(
          `INSERT INTO quotes (id, text, author)
           VALUES ($1, $2, $3)
           ON CONFLICT (id)
           DO UPDATE SET text = EXCLUDED.text, author = EXCLUDED.author`,
          [id, value.text, value.author]
        );
      }
      res.send('Quotes updated');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  app.delete('/quotes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM quotes WHERE id = $1', [id]);
      res.send(`Quote with id ${id} deleted`);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Start the server
const PORT = process.env.PORT || 8080;  // Change the port to 5001
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));