import NavBar from '@/components/custom/NavBar';
import Routine from '@/components/custom/Routine';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createRoutine, getRoutines, deleteRoutine } from '@/services/routineService';
import { getCurrentUserId } from '@/utils/sessions';
import { WorkoutPlayerDialog } from '@/components/custom/WorkoutPlayer'; // Import the new component
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageRoutinesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [routineToDelete, setRoutineToDelete] = useState(null);
    const [routineName, setRoutineName] = useState('');
    const [routines, setRoutines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [workoutPlayerOpen, setWorkoutPlayerOpen] = useState(false);
    const [selectedRoutineId, setSelectedRoutineId] = useState(null);
    const navigate = useNavigate();

    // Dialog Handlers
    const handleAddRoutine = () => setIsDialogOpen(true);
    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setRoutineName('');
    };

    // Fetch Routines on page load
    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) return;

        const fetchRoutines = async () => {
            setIsLoading(true);
            try {
                const res = await getRoutines(userId);
                setRoutines(res.data);
            } catch (error) {
                console.error('Error fetching routines', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoutines();
    }, []);

    // Save New Routine
    const handleSaveRoutine = async () => {
        const userId = getCurrentUserId();
        if (!routineName.trim() || !userId) return;

        setIsLoading(true);
        try {
            const res = await createRoutine(userId, routineName);
            setRoutines(prev => [...prev, res.data]);
            setRoutineName('');
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error adding routine', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditRoutine = (routine) => {
        navigate('/routine', {
            state: {
                routineName: routine.name,
                routineId: routine._id
            }
        });
    };

    // Handle Delete Routine
    const handleDeleteClick = (routine) => {
        setRoutineToDelete(routine);
        setConfirmDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!routineToDelete) return;

        setDeleteLoading(true);
        try {
            await deleteRoutine(routineToDelete._id);
            // Remove the deleted routine from state
            setRoutines(prev => prev.filter(r => r._id !== routineToDelete._id));
            setConfirmDeleteDialogOpen(false);
            setRoutineToDelete(null);
        } catch (error) {
            console.error('Error deleting routine', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Handle Play Routine
    const handlePlayClick = (routine) => {
        setSelectedRoutineId(routine._id);
        setWorkoutPlayerOpen(true);
    };

    return (
        <div className="flex flex-col gap-5 w-screen h-screen">
            <NavBar />
            <div className="px-6 flex flex-col gap-5">
                {/* Add Routine Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Button onClick={handleAddRoutine}>Add Routine</Button>
                    <DialogContent>
                        <div className="p-5 rounded-xl flex flex-col gap-3">
                            <p>Add a new routine</p>
                            <Input
                                placeholder="Routine Name"
                                value={routineName}
                                onChange={(e) => setRoutineName(e.target.value)}
                            />
                            <div className="flex justify-evenly">
                                <Button onClick={handleSaveRoutine} disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save'}
                                </Button>
                                <Button onClick={handleDialogClose}>Cancel</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Confirm Delete Dialog */}
                <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
                    <DialogContent>
                        <div className="p-5 rounded-xl flex flex-col gap-3">
                            <p className="font-semibold">Delete Routine</p>
                            <p>Are you sure you want to delete "{routineToDelete?.name}"? This action cannot be undone.</p>
                            <div className="flex justify-evenly">
                                <Button
                                    onClick={handleConfirmDelete}
                                    disabled={deleteLoading}
                                    variant="destructive"
                                >
                                    {deleteLoading ? 'Deleting...' : 'Delete'}
                                </Button>
                                <Button onClick={() => setConfirmDeleteDialogOpen(false)}>Cancel</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Workout Player Dialog */}
                <WorkoutPlayerDialog
                    routineId={selectedRoutineId}
                    isOpen={workoutPlayerOpen}
                    onOpenChange={setWorkoutPlayerOpen}
                />

                {/* Display Routines */}
                <div className="flex flex-col gap-3 border min-h-screen p-3 rounded-lg">
                    <h3 className="text-lg font-semibold text-center">Your Routines</h3>
                    {isLoading && routines.length === 0 ? (
                        <div className="flex justify-center items-center h-32">
                            <p>Loading routines...</p>
                        </div>
                    ) : routines.length === 0 ? (
                        <div className="flex justify-center items-center h-32">
                            <p>You don't have any routines yet. Add one to get started!</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {routines.map((routine) => (
                                <Routine
                                    key={routine._id}
                                    routineName={routine.name}
                                    onPlayClick={() => handlePlayClick(routine)}
                                    onEditClick={() => handleEditRoutine(routine)}
                                    onDeleteClick={() => handleDeleteClick(routine)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageRoutinesPage;