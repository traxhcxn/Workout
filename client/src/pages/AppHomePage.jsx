import NavBar from '@/components/custom/NavBar'
import StreakCalendar from '@/components/custom/StreakCalendar'
import WorkoutContainer from '../containers/WorkoutContainer'
import React from 'react'

function AppHomePage() {
    return (
        <div className='h-screen flex flex-col gap-5'>
            <NavBar />
            <div className='flex flex-col gap-6 items-center'>
                <StreakCalendar />
                <WorkoutContainer />
            </div>
        </div>
    )
}

export default AppHomePage