var url = require('url');
var fs = require('fs');
const Workout = require('./model/workout');


const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const assert = require('assert');

// Connection URL
const urldb = "mongodb+srv://admin:admin@cluster0-gduz3.mongodb.net/workouts?retryWrites=true&w=majority";

// Database Name
const dbName = 'workouts';

/*
* TODO meter la fecha en el server-side
* */

function renderFile(path, response) {
    fs.readFile(path, null, function (error, data) {
        if (error) {
            response.writeHead(404);
            response.write('File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
}

const findDocuments = function(db, res, callback) {
    // Get the documents collection
    const collection = db.collection('workouts');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        //console.log(docs)
        const JSON_workouts = JSON.stringify(docs);
        renderText(JSON_workouts, res);

        callback;
    });
}
//TODO rework todo lo de mongo
function getWorkouts(res) {
    const client = new MongoClient(urldb,{useUnifiedTopology: true , useNewUrlParser: true});
    const dbName = "workouts";
// Use connect method to connect to the server
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        const db = client.db(dbName);

        findDocuments(db, res, function() {
            client.close();
        });
    });
}

function insertWorkout(workout, response) {
    // Use connect method to connect to the server
    MongoClient.connect(urldb).then((client, err) => {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection('workouts');
        const result = collection.insertMany([
            workout
        ], function (err, result) {
            renderFile('./HTMLs/mensajes/success.txt', response);
            console.log("Inserted 1 document into the collection");
        });
        client.close();
    }).catch((error) => {
        console.error(error);
        renderFile('./HTMLs/mensajes/conection_error.txt', response);
    });
}

function renderText(text, response) {
    console.log(text);
    response.write(text);
    response.end();
}

function validateExercises(exercises) {
    let feedback = "";
    if (exercises[0][0] == "") {
        feedback += "Debe introducir por lo menos un ejercicio en la rutina\n";
        return feedback;
    }
    for(let i = 0; i < exercises.length; i++) {
        if (exercises[i][0] == "") {
            feedback += "Debe seleccionar un ejericico en cada entrada\n";
            return feedback;
        }
        if (exercises[i][1] == "" ) {
            feedback += "Debe introducir la duración del ejercicio\n";
            return feedback;
        }
    }
    return feedback;
}

function validateFormInput(input, response) {
    var feedback = "";
    if (input.name == "") {
        feedback += "El campo nombre es obligatorio \n";
    }
    if (input.description == "") {
        feedback += "El campo descripción es obligatorio \n";
    }

    feedback += validateExercises(input.exercises);

    if (feedback == "") {
        insertWorkout(input, response);
    } else {
        renderText(feedback, response);
    }

}

module.exports = {
    handleRequest: function (request, response) {
        var path = url.parse(request.url).pathname;
        var tmp_path = path.split('.');
        console.log(path);
        if (request.method == 'POST') {
            var body = '';
            request.on('data', (data) => {
                    body += data;
                }
            );
            request.on('end', () => {
                    var JSON_body = JSON.parse(body);
                    validateFormInput(JSON_body, response);
                }
            );
        } else {
            {
                switch (path) {
                    case '/workouts':
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        getWorkouts(response);
                        break;
                    case '/':
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        renderFile('./HTMLs/views/Form.html', response);
                        break;

                    default:
                        response.writeHead(200, {
                            "Cache-Control": "max-age=100000",
                                'Content-Type': 'text/'.concat(
                                    tmp_path[tmp_path.length - 1])
                            }
                        );
                        renderFile('./'.concat(path), response);
                        break;
                }
            }
        }

    }
};