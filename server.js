const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;



const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

require('dotenv').config();
// const { MONGO_CONNECT_STRING } = process.env;
app.use(cors());
// Add support for incoming JSON entities
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API Listening" })
});

// Adding a new movie from req.body
app.post("/api/movies", (req, res) => {
    if (Object.keys(req.body).length === 0) res.status(500).json({ error: "Invalid body" })
    else {
        db.addNewMovie(req.body)
            .then((data) => { res.status(201).json(data) })
            .catch((err) => { res.status(500).json({ error: err }) })
    }
});

// Getting movie by page, PerPage & borough query 

app.get("/api/movies", (req, res) => {
    if ((!req.query.page || !req.query.perPage)) res.status(500).json({ message: "Missing query parameters" })
    else {
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
            .then((data) => {
                if (data.length === 0) res.status(204).json({ message: "No data returned" });
                else res.status(201).json(data);
            })
            .catch((err) => { res.status(500).json({ error: err }) })
    }
});

// Getting movies by ID
app.get("/api/movies/:_id", (req, res) => {
    db.getMovieById(req.params._id)
        .then((data) => { res.status(201).json(data) })
        .catch((err) => { res.status(500).json({ error: err }) })
});

// Updating movie with req.body and the ID
app.put("/api/movies/:_id", (req, res) => {
    if (Object.keys(req.body).length === 0) res.status(500).json({ error: "Invalid body" })
    else {
        db.updateMovieById(req.body, req.params._id)
            .then(() => { res.status(201).json({ message: `Successfuly updated movie ${req.params._id}` }) })
            .catch((err) => { res.status(500).json({ error: err }) })
    }
});

// Deleting movie by ID
app.delete("/api/movies/:_id", (req, res) => {
    db.deleteMovieById(req.params._id)
        .then(() => { res.status(201).json({ message: `Successfuly deleted movie ${req.params._id}` }) })
        .catch((err) => { res.status(500).json({ error: err }) })
});


db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
}); ``