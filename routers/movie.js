const mongoose = require('mongoose');
const actor = require('../models/actor');
const Actor = require('../models/actor');
const movie = require('../models/movie');
const Movie = require('../models/movie');

module.exports = {
    getAll: function (req, res) {
        Movie.find({}).populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    deleteActor: function (req, res) {
        Movie.findOne({ _id: req.params.movieId }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json();
            //remove actor from movies actors
            console.log("actor ID to remove: " + movie.actors[movie.actors.indexOf(req.params.actorId)]);
            console.log("index: " + movie.actors.indexOf(req.params.actorId));
            movie.actors.splice(movie.actors.indexOf(req.params.actorId), 1);
            
            movie.save(function (err) {
                if (err) return res.status(500).json(err);

                Actor.findOne({movies: req.params.movieId}, function (err, actor) {
                    if (err) return res.status(400).json(err);
                    if (!actor) return res.status(404).json();
                    //remove movie from actors movies
                    console.log("movie ID to remove: " + actor.movies[actor.movies.indexOf(req.params.movieId)]);
                    actor.movies.splice(actor.movies.indexOf(req.params.movieId), 1);
                    res.json();

                    actor.save(function (err) {
                        if (err) return res.status(500).json(err);  
                    });
                })
            });
        });
    },
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    getByYear: function (req, res) {
        if(req.params.year1 < req.params.year2) {
        Movie.find({$and: [ {year: {$gte: req.params.year1}}, {year: {$lte: req.params.year2}} ]}, function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
        } else {return res.status(400).json(err);}
    },
    deleteByYear: function (req, res) {
        console.log(req.body);
        if(req.body.year1 < req.body.year2) {
        Movie.deleteMany({$and: [ {year: {$gte: req.body.year1}}, {year: {$lte: req.body.year2}} ]}, function (err, res) {
            if (err) return res.status(400).json(err);
        });
        } else {return res.status(400).json(err);}

    }
};