db = db.getSiblingDB('bcThesis');
var arrayOutput = output.split(/[ ]+/);     //creates correct array from given input
var first = arrayOutput.shift();            //removes first element from array (it's an empty string)
var date = new ISODate(Date.now());

db.Repository.insert(
    {
        name: name, 
        gitCommand: "diff",
        date: date, 
        content: output
    });

