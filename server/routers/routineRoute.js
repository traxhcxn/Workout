const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');

// Routine routes
router.post('/create-routine', routineController.createRoutine);
router.get('/:userId', routineController.getRoutines);

// Single routine operations
router.get('/single/:id', routineController.getRoutineById);
router.put('/:id', routineController.updateRoutine);
router.delete('/:id', routineController.deleteRoutine);

// Exercise routes
router.post('/:id/exercises', routineController.addExercise);
router.put('/:id/exercises/:exerciseId', routineController.updateExercise);
router.delete('/:id/exercises/:exerciseId', routineController.deleteExercise);

module.exports = router;