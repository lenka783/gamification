'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var exec = require('child_process').exec;
var obj = require("./datasources.json")
  , MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var url = obj.mongodb.connector + "://"
  + obj.mongodb.user + ":"
  + obj.mongodb.password + "@"
  + obj.mongodb.host + ":"
  + obj.mongodb.port + "/"
  + obj.mongodb.database;

var millisPerHour = 3600000;

var morningHour = 5;
var afternoonHour = 13;
var morningTimeSpan = morningHour + (24 - afternoonHour);
var afternoonTimeSpan = afternoonHour - morningHour;

app.start = function () {
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }

    console.log("Setting up timers.");

    var now = new Date();
    var millisTillMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), morningHour, 0, 0, 0) - now;
    var millisTillAfternoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), afternoonHour, 0, 0, 0) - now;
    if (millisTillMorning < 0) {
      millisTillMorning += 86400000; // it's after morning timeout hour, set for tomorrow.
    }
    if (millisTillAfternoon < 0) {
      millisTillAfternoon += 86400000; // it's after afternoon timeout hour, set for tomorrow.
    }
    //morning timeout
    setTimeout(function () {
      updateCommitsChanges(morningTimeSpan);
      setInterval(() => {
        updateCommitsChanges(morningTimeSpan);
      }, 24 * millisPerHour);
    }, millisTillMorning);

    //afternoon timeout
    setTimeout(function () {
      updateCommitsChanges(afternoonTimeSpan);
      setInterval(() => {
        updateCommitsChanges(afternoonTimeSpan);
      }, 24 * millisPerHour);
    }, millisTillAfternoon);

  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});


//decides what achievements has been achieved and what not.
function commitsChangeUpdate(timeSpan, callback) {
  var updateCollection = []
  MongoClient.connect(url, (errorDatabase, db) => {
    assert.equal(null, errorDatabase);

    var collection = db.collection('Achievement');

    collection.find().each((errorContributor, document) => {
      assert.equal(null, errorContributor);
      console.log("Connected correctly to server");
      if (document != null) {
        var command = "./scripts/git_diff.sh " +
          document.repositoryLocalAddress + " \"" +
          document.contributorName + "\" \"" +
          document.gitSearchPattern + "\" " + timeSpan

        exec(command, (error, stdout, stderr) => {
          var now = new Date();
          var shouldUpdate = (now - document.lastUpdated) > 24 * millisPerHour;
          if (stdout != '0') {
            if (shouldUpdate) {
              document.daysInRow += 1;
              document.lastUpdated = now;
              updateCollection.push(document);
            }
          } else {
            if (shouldUpdate) {
              document.daysInRow = 0;
              document.lastUpdated = now;
              updateCollection.push(document);
            }
          }
          if (error !== null) {
            console.log('exec error: ' + error);
          }
          callback(updateCollection);
        });
      }
    });
    db.close();
  });

}

//updates achievements that were changed
function updateCommitsChanges(timeSpan) {
  commitsChangeUpdate(timeSpan, (achievementsToUpdate) => {
    achievementsToUpdate.forEach(achievement => {
      MongoClient.connect(url, (errorDatabase, db) => {
        assert.equal(null, errorDatabase);

        db.collection('Achievement').updateOne(
          { _id: achievement._id },
          { $set: { daysInRow: achievement.daysInRow, lastUpdated: achievement.lastUpdated } });
        db.close();
      });
    });
  })
}
