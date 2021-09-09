const mongoose = require('mongoose');
const actor = require('../models/actor');
const Actor = require('../models/actor');
const movie = require('../models/movie');
const Movie = require('../models/movie');

module.exports = {
    getAll: function (req, res) {
        Actor.find({}).populate('movies').exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        });
    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    deleteActorAndMovies: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
            Movie.deleteMany({actors: req.params.id}, function (err) {
                if (err) return res.status(400).json(err);
                res.json();
            })
        });
    },
    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    deleteMovie: function (req, res) {
        Actor.findOne({ _id: req.params.actorId }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json();
            //remove movie from actors movies
            console.log("movie ID to remove: " + actor.movies[actor.movies.indexOf(req.params.movieId)]);
            actor.movies.splice(actor.movies.indexOf(req.params.movieId), 1);
            actor.save(function (err) {
                if (err) return res.status(500).json(err);  
                
                Movie.findOne({actors: req.params.actorId}, function (err, movie) {
                    if (err) return res.status(400).json(err);
                    if (!movie) return res.status(404).json();
                    //remove actor from movies actors
                    console.log("actor ID to remove: " + movie.actors[movie.actors.indexOf(req.params.actorId)]);
                    movie.actors.splice(movie.actors.indexOf(req.params.actorId), 1);
                    res.json();

                    movie.save(function (err) {
                        if (err) return res.status(500).json(err);  
                    });
                })
            });

            
        });
    }
};