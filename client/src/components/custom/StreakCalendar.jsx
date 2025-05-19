import React, { useState, useRef } from 'react';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

const StreakCalendar = () => {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const scrollContainerRef = useRef(null);

    // Initial week setup
    const generateWeeks = (offset) => {
        const baseDay = new Date();
        baseDay.setDate(baseDay.getDate() - ((baseDay.getDay() + 6) % 7) + (offset * 7));
        
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(baseDay);
            day.setDate(day.getDate() + i);
            weekDays.push({
                dayName: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
                date: day,
                status: null,
                clickCount: 0 // Track the number of clicks
            });
        }
        return weekDays;
    };

    const [weeks, setWeeks] = useState({
        '-1': generateWeeks(-1),
        '0': generateWeeks(0),
        '1': generateWeeks(1)
    });

    // Track last click time for each day to detect double clicks
    const [lastClickTime, setLastClickTime] = useState({});

    const scrollToPreviousWeek = () => {
        if (currentWeekOffset > -4) {
            const newOffset = currentWeekOffset - 1;
            
            if (!weeks[newOffset - 1]) {
                setWeeks(prev => ({
                    ...prev,
                    [newOffset - 1]: generateWeeks(newOffset - 1)
                }));
            }
            
            setCurrentWeekOffset(newOffset);
            scrollContainerRef.current.scrollTo({
                left: scrollContainerRef.current.scrollWidth / 3,
                behavior: 'smooth'
            });
        }
    };

    const scrollToNextWeek = () => {
        if (currentWeekOffset < 4) {
            const newOffset = currentWeekOffset + 1;
            
            if (!weeks[newOffset + 1]) {
                setWeeks(prev => ({
                    ...prev,
                    [newOffset + 1]: generateWeeks(newOffset + 1)
                }));
            }
            
            setCurrentWeekOffset(newOffset);
            scrollContainerRef.current.scrollTo({
                left: scrollContainerRef.current.scrollWidth / 3,
                behavior: 'smooth'
            });
        }
    };

    // Cycle between green check (true), red cross (false), and reset (null)
    const toggleDayStatus = (weekOffset, dayIndex) => {
        const dayKey = `${weekOffset}-${dayIndex}`;
        const now = new Date().getTime();
        const lastClick = lastClickTime[dayKey] || 0;
        const isDoubleClick = now - lastClick < 300; // 300ms double-click threshold
    
        setWeeks(prev => {
            const newWeeks = { ...prev };
            const weekToUpdate = [...newWeeks[weekOffset]];
            
            const currentStatus = weekToUpdate[dayIndex].status;
            
            if (isDoubleClick) {
                // If double click, set to red cross (false)
                weekToUpdate[dayIndex].status = false;
            } else if (currentStatus === true) {
                // If it's already green, reset to null
                weekToUpdate[dayIndex].status = null;
            } else {
                // Otherwise, set to green check (true)
                weekToUpdate[dayIndex].status = true;
            }
            
            newWeeks[weekOffset] = weekToUpdate;
            return newWeeks;
        });
    
        // Update click time
        setLastClickTime(prev => ({
            ...prev,
            [dayKey]: now
        }));
    
        // Update streak after state update
        setTimeout(updateStreak, 0);
    };    

    const updateStreak = () => {
        let streak = 0;
        let foundMissed = false;
        
        const allDays = [];
        const offsets = Object.keys(weeks).sort((a, b) => Number(a) - Number(b));
        
        offsets.forEach(offset => {
            weeks[offset].forEach(day => {
                allDays.push(day);
            });
        });
        
        const today = new Date();
        let todayOverallIndex = -1;
        
        for (let i = 0; i < allDays.length; i++) {
            const dayDate = allDays[i].date;
            if (dayDate.toDateString() === today.toDateString()) {
                todayOverallIndex = i;
                break;
            }
        }
        
        if (todayOverallIndex >= 0) {
            for (let i = todayOverallIndex; i >= 0; i--) {
                if (allDays[i].status === true && !foundMissed) {
                    streak++;
                } else if (allDays[i].status === false) {
                    foundMissed = true;
                } else if (allDays[i].status === null && streak > 0) {
                    break;
                }
            }
        }
        
        setCurrentStreak(streak);
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const formatWeekLabel = (offset) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7) + (offset * 7));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        const options = { month: 'short', day: 'numeric' };
        return `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`;
    };

    return (
        <div className="mt-5 px-5 py-2 shadow-lg rounded-b-lg">
            <div className="flex px-2 justify-between items-center mb-5">
                <div>
                    <p className="text-xs font-medium text-gray-500">CURRENT STREAK</p>
                    <h2 className="text-md font-bold">{currentStreak} days</h2>
                </div>
                <div className="flex items-center">
                    <button 
                        onClick={scrollToPreviousWeek}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 mr-1"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={scrollToNextWeek}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
            
            <div className="text-xs text-center font-medium text-gray-500 mb-3">
                {formatWeekLabel(currentWeekOffset)}
            </div>
            
            <div className="overflow-x-hidden py-2" ref={scrollContainerRef}>
                <div className="flex justify-between px-1">
                    {weeks[currentWeekOffset].map((day, index) => (
                        <div key={index} className="relative flex items-center justify-center p-1">
                            {isToday(day.date) && (
                                <div className="absolute size-10 rounded-full border-2 border-blue-400"></div>
                            )}
                            <button
                                onClick={() => toggleDayStatus(currentWeekOffset, index)}
                                className={`size-8 rounded-full flex items-center justify-center transition-all ${
                                    day.status === true
                                        ? 'bg-green-500 text-white shadow-sm'
                                        : day.status === false
                                            ? 'bg-red-500 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {day.status === null ? (
                                    <span className="text-sm font-medium">{day.dayName}</span>
                                ) : day.status === true ? (
                                    <Check size={16} />
                                ) : (
                                    <X size={16} />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StreakCalendar;
