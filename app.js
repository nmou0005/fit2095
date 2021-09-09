const express = require('express');
const mongoose = require('mongoose');
const actors = require('./routers/actor');
const movies = require('./routers/movie');
//for test data
const Actor = require('./models/actor');
const Movie = require('./models/movie');


const app = express();
app.listen(3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


mongoose.connect('mongodb://localhost:27017/movies', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');

    //create test data
    /*
    let actor1 = new Actor ({
        _id: new mongoose.Types.ObjectId(),
        name: "Actor1",
        bYear: 1999,
    });
    actor1.save(function (err, data) {
        if (err)  throw err;  
        console.log("Test Actor successfully Added to DB", data);

        let movie1 = new Movie ({
            _id: new mongoose.Types.ObjectId(),
            title: "Movie1",
            year: 2012,
            actors: actor1._id
        });
        movie1.save(function (err, data) {
            if (err)  throw err;  
            console.log("Test Movie successfully Added to DB", data);
        });
    });
    */
});


//Configuring Endpoints
//Actor RESTFul endpoionts 
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movie', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);
//Delete an actor by its ID and all its movies from the 'Movie' collection.
app.delete('/actors/deleteAM/:id', actors.deleteActorAndMovies);
//Remove a movie from the list of movies of an actor
app.put('/actors/:actorId/:movieId', actors.deleteMovie);

//Movie RESTFul  endpoints
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);
//delete movie by id
app.delete('/movies/:id', movies.deleteOne);
//Remove an actor from the list of actors in a movie
app.put('/movies/:movieId/:actorId', movies.deleteActor);
//Add an existing actor to the list of actors in a movie
app.post('/movies/:id/actor', movies.addActor);
//Retrieve (GET) all the movies produced between year1 and year2, where year1>year2.
app.get('/movies/years/:year1/:year2', movies.getByYear);
//Delete all the movies that are produced between two years. 
//The two years (year1 & year2) must be sent to the backend server through the request's body in JSON format.
app.post('/movies/years', movies.deleteByYear);