const Routine = require('../models/RoutineModel');

// POST /routines/create-routine
exports.createRoutine = async (req, res) => {
    const { userId, name } = req.body;
    if (!userId || !name) return res.status(400).json({ error: "Missing fields" });

    try {
        const newRoutine = new Routine({ userId, name, exercises: [] });
        await newRoutine.save();
        res.status(201).json(newRoutine);
    } catch (err) {
        res.status(500).json({ error: "Failed to create routine" });
    }
};

// GET /routines/:userId
exports.getRoutines = async (req, res) => {
    try {
        const routines = await Routine.find({ userId: req.params.userId });
        res.status(200).json(routines);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch routines" });
    }
};

// GET /routines/single/:id
exports.getRoutineById = async (req, res) => {
    try {
        const routine = await Routine.findById(req.params.id);
        if (!routine) return res.status(404).json({ error: "Routine not found" });
        res.status(200).json(routine);
    } catch (err) {
        res.status(500).json({ error: "Error fetching routine" });
    }
};

// PUT /routines/:id
exports.updateRoutine = async (req, res) => {
    try {
        const updated = await Routine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: "Error updating routine" });
    }
};

// DELETE /routines/:id
exports.deleteRoutine = async (req, res) => {
    try {
        await Routine.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: "Error deleting routine" });
    }
};

// POST /routines/:id/exercises
exports.addExercise = async (req, res) => {
    const { name, type, value } = req.body;
    try {
        const routine = await Routine.findById(req.params.id);
        routine.exercises.push({ name, type, value });
        await routine.save();
        res.status(200).json(routine);
    } catch (err) {
        res.status(500).json({ error: "Failed to add exercise" });
    }
};

// PUT /routines/:id/exercises/:exerciseId
exports.updateExercise = async (req, res) => {
    try {
        const routine = await Routine.findById(req.params.id);
        const exercise = routine.exercises.id(req.params.exerciseId);
        Object.assign(exercise, req.body);
        await routine.save();
        res.status(200).json(routine);
    } catch (err) {
        res.status(500).json({ error: "Failed to update exercise" });
    }
};

// DELETE /routines/:id/exercises/:exerciseId
exports.deleteExercise = async (req, res) => {
    try {
        const routine = await Routine.findById(req.params.id);
        routine.exercises = routine.exercises.filter(e => e._id.toString() !== req.params.exerciseId);
        await routine.save();
        res.status(200).json(routine);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete exercise" });
    }
};
