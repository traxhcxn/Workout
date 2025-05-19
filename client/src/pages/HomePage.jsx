import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
    return (
        <div className='w-screen h-screen flex flex-col'>
            <div className='h-3/5'></div>
            <div className='w-full border-t-5 h-2/5 rounded-t-[50px] px-18 flex flex-col gap-7 justify-center items-center'>
                <Button className={"w-full"}>
                    <Link to={'/sign-up'}>Create Account</Link>
                </Button>
                <Button className={"w-full"}>
                    <Link to={'/login'}>Log In</Link>
                </Button>
            </div>
        </div>
    )
}

export default HomePage