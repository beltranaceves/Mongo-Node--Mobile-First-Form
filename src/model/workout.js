const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: Array
    },
    image: {
        type: String,
    },
    exercises: {
        type: Array,
    }
});

module.exports = mongoose.model('Workout', workoutSchema);