const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['reps', 'time'], required: true },
    value: { type: String, required: true },
});

const RoutineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    exercises: [ExerciseSchema],
}, { timestamps: true });

module.exports = mongoose.model('Routine', RoutineSchema);