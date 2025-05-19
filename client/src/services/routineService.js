import axiosClient from './axiosClient';

// Create a new routine
export const createRoutine = (userId, routineName) => {
    return axiosClient.post('/routines/create-routine', {
        userId,
        name: routineName,
    });
};

// Get all routines for a user
export const getRoutines = (userId) => {
    return axiosClient.get(`/routines/${userId}`);
};

// Get routine by ID
export const getRoutineById = (routineId) => {
    return axiosClient.get(`/routines/single/${routineId}`);
};

// Add exercise to a routine
export const addExerciseToRoutine = (routineId, exercise) => {
    return axiosClient.post(`/routines/${routineId}/exercises`, exercise);
};

// Update an exercise
export const updateExercise = (routineId, exerciseId, updatedExercise) => {
    return axiosClient.put(`/routines/${routineId}/exercises/${exerciseId}`, updatedExercise);
};

// Delete an exercise
export const deleteExercise = (routineId, exerciseId) => {
    return axiosClient.delete(`/routines/${routineId}/exercises/${exerciseId}`);
};

// Update a routine
export const updateRoutine = (routineId, routineData) => {
    return axiosClient.put(`/routines/${routineId}`, routineData);
};

// Update routine name
export const updateRoutineName = (routineId, newName) => {
    return axiosClient.patch(`/routines/${routineId}/update-name`, {
        name: newName,
    });
};


// Delete a routine
export const deleteRoutine = (routineId) => {
    return axiosClient.delete(`/routines/${routineId}`);
};