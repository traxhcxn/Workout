import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, Minus, CheckCircle, XCircle } from 'lucide-react';
import { getRoutineById } from '@/services/routineService';

// Main component to handle workout play functionality
function WorkoutPlayer({ routineId, onComplete, onClose }) {
    const [routine, setRoutine] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [restTime, setRestTime] = useState(10); // Default rest time in seconds
    const [intervalId, setIntervalId] = useState(null);
    const [workoutComplete, setWorkoutComplete] = useState(false);
    const [exerciseTimer, setExerciseTimer] = useState(0); // Timer for exercise

    // Fetch routine details when component mounts
    useEffect(() => {
        const fetchRoutineDetails = async () => {
            setIsLoading(true);
            try {
                const response = await getRoutineById(routineId);
                console.log("Routine data:", response.data);
                setRoutine(response.data);
            } catch (error) {
                console.error('Error fetching routine details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoutineDetails();
    }, [routineId]);

    // Clean up interval on unmount
    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    // Start rest timer
    useEffect(() => {
        if (isResting && restTime > 0) {
            const id = setInterval(() => {
                setRestTime(prev => {
                    if (prev <= 1) {
                        clearInterval(id);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            setIntervalId(id);

            return () => clearInterval(id);
        } else if (isResting && restTime === 0) {
            // Rest period is over
            handleRestComplete();
        }
    }, [isResting, restTime]);

    // Handle when user completes an exercise
    const handleExerciseComplete = () => {
        if (intervalId) clearInterval(intervalId);

        // If this was the last exercise, complete the workout
        if (currentExerciseIndex >= routine.exercises.length - 1) {
            setWorkoutComplete(true);
            return;
        }

        // Otherwise, start rest period
        setIsResting(true);
        setRestTime(10); // Reset to default rest time
    };

    // Handle when rest period completes
    const handleRestComplete = () => {
        setIsResting(false);
        setCurrentExerciseIndex(prev => prev + 1);
    };

    // Adjust rest time
    const adjustRestTime = (seconds) => {
        setRestTime(prev => Math.max(0, prev + seconds));
    };

    // Handle final completion of workout
    const handleWorkoutFinish = () => {
        if (onComplete) onComplete();
        if (onClose) onClose();
    };

    // Skip rest period
    const skipRest = () => {
        if (intervalId) clearInterval(intervalId);
        handleRestComplete();
    };

    // Start the exercise timer and countdown
    const startExerciseTimer = (seconds) => {
        setExerciseTimer(seconds); // Set initial timer based on exercise time
        const id = setInterval(() => {
            setExerciseTimer(prev => {
                if (prev <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        setIntervalId(id);
    };

    // Adjust exercise time (+/- 5 or 10 seconds)
    const adjustExerciseTime = (seconds) => {
        setExerciseTimer(prev => Math.max(0, prev + seconds));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-xl">Loading workout...</p>
            </div>
        );
    }

    if (!routine || !routine.exercises || routine.exercises.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-xl">No exercises found in this routine.</p>
                <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
        );
    }

    if (workoutComplete) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-5">Workout Complete!</h2>
                <Button onClick={handleWorkoutFinish} className="px-8">Finish</Button>
            </div>
        );
    }

    const currentExercise = routine.exercises[currentExerciseIndex];
    const isTimeBasedExercise = currentExercise.type === 'time';

    if (isResting) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Rest</h2>
                <p className="text-6xl font-bold mb-8">{restTime}s</p>

                <div className="flex gap-4 mb-8">
                    <Button onClick={() => adjustRestTime(-5)} disabled={restTime <= 5} className="px-4">
                        -5s
                    </Button>
                    <Button onClick={() => adjustRestTime(-10)} disabled={restTime <= 10} className="px-4">
                        -10s
                    </Button>
                    <Button onClick={() => adjustRestTime(5)} className="px-4">
                        +5s
                    </Button>
                    <Button onClick={() => adjustRestTime(10)} className="px-4">
                        +10s
                    </Button>
                </div>

                <Button onClick={skipRest} variant="outline" className="px-8">
                    Skip Rest
                </Button>

                <p className="mt-8 text-sm text-gray-500">
                    Next: {currentExerciseIndex < routine.exercises.length - 1 ?
                        routine.exercises[currentExerciseIndex + 1].name :
                        'Workout Complete'}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">
                    Exercise {currentExerciseIndex + 1} of {routine.exercises.length}
                </p>
                <h2 className="text-3xl font-bold mb-2">{currentExercise.name}</h2>

                {isTimeBasedExercise ? (
                    <div className="flex flex-col items-center">
                        <p className="text-xl mb-4">{exerciseTimer}s</p>
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className='flex gap-2'>
                                <Button onClick={() => startExerciseTimer(currentExercise.value)} className="px-12 py-4 text-lg">
                                    Start
                                </Button>
                                <Button onClick={handleExerciseComplete} className="px-12 py-4 text-lg">
                                    Done
                                </Button>
                            </div>
                            <div className='flex gap-4'>
                                <Button onClick={() => adjustExerciseTime(-10)} disabled={exerciseTimer <= 10} className="px-4">
                                    -10s
                                </Button>
                                <Button onClick={() => adjustExerciseTime(-5)} disabled={exerciseTimer <= 5} className="px-4">
                                    -5s
                                </Button>
                                <Button onClick={() => adjustExerciseTime(5)} className="px-4">
                                    +5s
                                </Button>
                                <Button onClick={() => adjustExerciseTime(10)} className="px-4">
                                    +10s
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <p className="text-2xl font-semibold mb-8">
                            {currentExercise.value} reps
                        </p>
                        <Button onClick={handleExerciseComplete} className="px-12 py-4 text-lg">
                            Done
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-12">
                {currentExercise.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg max-w-md">
                        <p className="font-medium mb-1">Notes:</p>
                        <p>{currentExercise.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Dialog wrapper for the workout player
function WorkoutPlayerDialog({ routineId, isOpen, onOpenChange }) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} className="w-full max-w-none">
            <DialogContent className="p-0 w-screen h-screen max-w-none max-h-none">
                <WorkoutPlayer
                    routineId={routineId}
                    onClose={() => onOpenChange(false)}
                    onComplete={() => {
                        // You could add additional actions here after workout completion
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

export { WorkoutPlayerDialog };