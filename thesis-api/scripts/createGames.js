#!/usr/bin/env node

var accountEmail = "admin@thesis.cz";
var database = "mongodb://localhost:27017/bcThesis";

var MongoClient = require('mongodb').MongoClient;
var path = require('path');


console.log("Application initialization begins.");

createGames((length) => {
    console.log("Created games: " + length);
});

function createGames(callback) {
    MongoClient.connect(database,
        (error, db) => {
            if (error) { return console.dir(error); }

            console.log("Creating supported games.");
            var collection = db.collection('Game');
            var games = [
                {
                    Name: "testGame",
                    CommonName: "Unit test writing game",
                    GitSearchPattern: "[tT]est"
                },
                {
                    Name: "documentationGame",
                    CommonName: "Correct documentation writing game",
                    GitSearchPattern: "/[*].*[*]/"
                },
                {
                    Name: "loggingGame",
                    CommonName: "Log writing game",
                    GitSearchPattern: "[Ll]og"
                },
                {
                    Name: "goodCollaboratorGame",
                    CommonName: "Good commiter game",
                    GitSearchPattern: "."
                }];
            collection.insert(games, { w: 1 }, (err, result) => {
                if (err) { return console.dir(err) }
                callback(games.length);
            });
            db.close();
        });
}