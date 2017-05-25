#!/usr/bin/env node

var accountEmail = "admin@thesis.cz";
var database = "mongodb://localhost:27017/bcThesis";

var MongoClient = require('mongodb').MongoClient;
var path = require('path');

console.log("Creating test data.");

getAccount((account) => {
    console.log("AccountID: " + account);
    createTestRepositories((repositoryID) => {
        console.log("RepositoryID: " + repositoryID);

        createRepositoryContributor(account.contributerName, account._id, repositoryID, (contributorID) => {
            console.log("ContributorID: " + contributorID);
        });
    });
});

function getAccount(callback) {
    MongoClient.connect(database,
        (error, db) => {
            if (error) { return console.dir(error); }

            console.log("Retrieving accountID for account with email: " + accountEmail + ".");
            var collection = db.collection('Account');
            collection.findOne({ email: accountEmail }, (error, result) => {
                if (error) { return console.dir("Error while creating account: " + err) }
                callback(result);
            });
            db.close();
        });
}

function createTestRepositories(callback) {
    MongoClient.connect(database,
        (error, db) => {
            if (error) { return console.dir(error); }

            console.log("Creating test repository.");
            var collection = db.collection('Repository');
            var repository = {
                projectName: "Test",
                gitAddress: ""
            };
            collection.insert(repository, (err) => {
                if (err) { return console.dir("Error while creating repository: " + err) }
                callback(repository._id);
            });
            db.close();
        });
}

function createRepositoryContributor(contributorName, accountID, repositoryID, callback) {
    MongoClient.connect(database,
        (error, db) => {
            if (error) { return console.dir(error); }

            console.log("Creating test repository.");
            var collection = db.collection('RepositoryContributor');
            console.log("Local adress")
            var contributor = {
                contributor: contributorName,
                localAddress: path.join("$HOME", "Documents", "test"),
                accountID: accountID,
                repositoryID: repositoryID
            };
            collection.insert(contributor, (err) => {
                if (err) { return console.dir("Error while adding contributor: " + err) }
                callback(contributor._id);
            });
            db.close();
        });
}