import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { addExerciseToRoutine, updateExercise, deleteExercise, getRoutineById, updateRoutineName } from '@/services/routineService';
import { getCurrentUserId } from '@/utils/sessions';
import NavBar from '@/components/custom/NavBar';
import { Pencil } from 'lucide-react';

function RoutinesVarPage() {
    const location = useLocation();
    const routineName = location.state?.routineName || 'Unnamed Routine';
    const routineId = location.state?.routineId;
    const userId = getCurrentUserId();

    const [exercises, setExercises] = useState([]);
    const [newExercise, setNewExercise] = useState({
        name: '',
        type: 'reps',
        value: ''
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [editExercise, setEditExercise] = useState({
        name: '',
        type: 'reps',
        value: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [updatedRoutineName, setUpdatedRoutineName] = useState(routineName);


    // If a routineId is passed, fetch its data
    useEffect(() => {
        if (routineId) {
            fetchRoutineData();
        }
    }, [routineId]);

    const fetchRoutineData = async () => {
        try {
            setIsLoading(true);
            const response = await getRoutineById(routineId);
            setExercises(response.data.exercises || []);
        } catch (error) {
            console.error("Error fetching routine:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddExercise = async () => {
        if (!newExercise.name.trim() || !newExercise.value.trim()) {
            alert("Exercise name and value are required");
            return;
        }

        if (routineId) {
            // If we have a routineId, add to the existing routine
            try {
                setIsLoading(true);
                const response = await addExerciseToRoutine(routineId, newExercise);
                setExercises(response.data.exercises);
                setNewExercise({ name: '', type: 'reps', value: '' });
            } catch (error) {
                console.error("Error adding exercise:", error);
                alert("Failed to add exercise");
            } finally {
                setIsLoading(false);
            }
        } else {
            // If no routineId yet, just add to local state
            // (You might want to handle this differently depending on your app's flow)
            setExercises((prev) => [...prev, newExercise]);
            setNewExercise({ name: '', type: 'reps', value: '' });
        }
    };

    const handleDelete = async (index) => {
        if (routineId && exercises[index]._id) {
            // Delete from backend if we have IDs
            try {
                setIsLoading(true);
                const exerciseId = exercises[index]._id;
                await deleteExercise(routineId, exerciseId);
                setExercises(prev => prev.filter((_, i) => i !== index));
                if (editingIndex === index) setEditingIndex(null);
            } catch (error) {
                console.error("Error deleting exercise:", error);
                alert("Failed to delete exercise");
            } finally {
                setIsLoading(false);
            }
        } else {
            // Just update local state if no IDs yet
            setExercises((prev) => prev.filter((_, i) => i !== index));
            if (editingIndex === index) setEditingIndex(null);
        }
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditExercise({ ...exercises[index] });
    };

    const handleSaveEdit = async (index) => {
        if (routineId && exercises[index]._id) {
            // Update via API if we have IDs
            try {
                setIsLoading(true);
                const exerciseId = exercises[index]._id;
                const response = await updateExercise(routineId, exerciseId, editExercise);

                // Find updated exercise in response and update our state
                const updatedExercise = response.data.exercises.find(ex => ex._id === exerciseId);
                const updatedExercises = [...exercises];
                updatedExercises[index] = updatedExercise;
                setExercises(updatedExercises);
                setEditingIndex(null);
            } catch (error) {
                console.error("Error updating exercise:", error);
                alert("Failed to update exercise");
            } finally {
                setIsLoading(false);
            }
        } else {
            // Just update local state if we don't have IDs yet
            const updated = [...exercises];
            updated[index] = editExercise;
            setExercises(updated);
            setEditingIndex(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
    };

    const handleUpdateRoutineName = async () => {
        if (!updatedRoutineName.trim()) {
            alert("Routine name can't be empty");
            return;
        }

        try {
            setIsLoading(true);
            await updateRoutineName(routineId, updatedRoutineName);
            setIsEditingName(false);
        } catch (err) {
            console.error("Failed to update routine name:", err);
            alert("Failed to update routine name");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col gap-5 w-screen h-screen">
            <NavBar />
            <div className="px-6 max-w-3xl mx-auto flex flex-col gap-6 pb-8">
                <div className="flex items-center gap-3">
                    {isEditingName ? (
                        <>
                            <Input
                                value={updatedRoutineName}
                                onChange={(e) => setUpdatedRoutineName(e.target.value)}
                                className="text-xl font-bold"
                            />
                            <Button onClick={handleUpdateRoutineName} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button variant="ghost" onClick={() => {
                                setIsEditingName(false);
                                setUpdatedRoutineName(routineName);
                            }}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold">{updatedRoutineName}</h1>
                            <Button variant="ghost" onClick={() => setIsEditingName(true)}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>


                {/* Add Exercise */}
                <div className="border rounded-lg p-5 space-y-4 shadow-md">
                    <h2 className="text-xl font-semibold">Add Exercise</h2>
                    <Input
                        placeholder="Exercise Name"
                        value={newExercise.name}
                        onChange={(e) =>
                            setNewExercise((prev) => ({ ...prev, name: e.target.value }))
                        }
                    />
                    <div className="flex gap-4 items-center">
                        <Select
                            value={newExercise.type}
                            onValueChange={(val) =>
                                setNewExercise((prev) => ({ ...prev, type: val }))
                            }
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="reps">Reps</SelectItem>
                                <SelectItem value="time">Time (secs)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder={newExercise.type === 'reps' ? 'No. of Reps' : 'Duration (secs)'}
                            type="number"
                            value={newExercise.value}
                            onChange={(e) =>
                                setNewExercise((prev) => ({ ...prev, value: e.target.value }))
                            }
                        />
                    </div>
                    <Button onClick={handleAddExercise} disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add to Routine'}
                    </Button>
                </div>

                {/* Display Exercises */}
                <div className="border rounded-lg p-5 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Exercises</h2>
                    {exercises.length === 0 ? (
                        <p>No exercises yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {exercises.map((ex, idx) => (
                                <li key={ex._id || idx} className="flex justify-between items-center border rounded p-3">
                                    {editingIndex === idx ? (
                                        <div className="flex flex-col gap-2 w-full">
                                            <Input
                                                value={editExercise.name}
                                                onChange={(e) =>
                                                    setEditExercise((prev) => ({
                                                        ...prev,
                                                        name: e.target.value
                                                    }))
                                                }
                                            />
                                            <div className="flex gap-3 items-center">
                                                <Select
                                                    value={editExercise.type}
                                                    onValueChange={(val) =>
                                                        setEditExercise((prev) => ({
                                                            ...prev,
                                                            type: val
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger className="w-[140px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="reps">Reps</SelectItem>
                                                        <SelectItem value="time">Time (secs)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    type="number"
                                                    value={editExercise.value}
                                                    onChange={(e) =>
                                                        setEditExercise((prev) => ({
                                                            ...prev,
                                                            value: e.target.value
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={() => handleSaveEdit(idx)} disabled={isLoading}>
                                                    {isLoading ? 'Saving...' : 'Save'}
                                                </Button>
                                                <Button variant="ghost" onClick={handleCancelEdit}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="font-medium">{ex.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {ex.type === 'reps' ? `${ex.value} reps` : `${ex.value} secs`}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" onClick={() => handleEdit(idx)} disabled={isLoading}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleDelete(idx)}
                                                    disabled={isLoading}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RoutinesVarPage;