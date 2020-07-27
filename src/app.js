var url = require('url');
var fs = require('fs');


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const urldb = 'mongodb://localhost:27017';

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
};

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
                    case '/':
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        renderFile('./HTMLs/alternative/Form.html', response);
                        break;
                    /*
                case '/style.css':
                    response.writeHead(200, {'Content-Type': 'text/css'});
                    renderFile('./stylesheets/style.css', response);
                    break;
                     */
                    case '/client.js':
                        response.writeHead(200, {'Content-Type': 'text/js'});
                        renderFile('./javascripts/client.js', response);
                        break;

                    default:
                        /*
                        response.writeHead(404);
                        response.write('Route not defined');
                        response.end();
                         */
                        response.writeHead(200, {
                                'Content-Type': 'text/'.concat(
                                    tmp_path[tmp_path.length - 1])
                            }
                        );
                        renderFile('./HTMLs/alternative/'.concat(path), response);
                        break;
                }
            }
        }

    }
};