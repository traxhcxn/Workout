import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx' // optional for cleaner class logic
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { jwtDecode } from 'jwt-decode'

function NavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState({
        username: '',
        email: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const decoded = jwtDecode(token)
                console.log(decoded)
                setUser({
                    username: decoded.username || '',
                    email: decoded.email || ''
                })
            } catch (error) {
                console.error('Invalid Token')
            }
        }
    }, [])

    const getInitials = (name) => {
        return name ? name.slice(0, 2).toUpperCase() : 'NA'
    }

    return (
        <>
            <div className='flex w-full py-2 px-3 items-center justify-between'>
                <Button variant={"ghost"} onClick={() => setIsOpen(true)}>
                    <Menu color='black' className='size-6' />
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Avatar>
                            <AvatarImage />
                            <AvatarFallback className={"text-sm font-semibold"}>{getInitials(user.username)}</AvatarFallback>
                        </Avatar>
                    </DialogTrigger>
                    <DialogContent>
                        <div className='flex gap-5 items-center'>
                            <Avatar className={"size-20"}>
                                <AvatarImage />
                                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                            </Avatar>
                            <div className='text-sm'>
                                <div className='flex flex-col gap-1'>
                                    <p className='text-lg font-semibold'>{user.username}</p>
                                    <p>{user.email}</p>
                                    <p>Current Streak: </p>
                                </div>
                                <div className='flex gap-2 mt-5'>
                                    <Button variant={'outline'} onClick={() => navigate('/settings')}>Edit Profile</Button>
                                    <Button variant={'outline'} onClick={() => {
                                        localStorage.removeItem('token')
                                        navigate('/')
                                    }}>Logout</Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className={clsx(
                "fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <Button variant={"ghost"} size={"icon"} onClick={() => setIsOpen(false)}>
                        <X />
                    </Button>
                </div>
                <div className="p-4 space-y-3">
                    <Link to="/home" className="block">Home</Link>
                    <Link to="/manage-routines" className="block">Manage Routines</Link>
                    <Link to="/settings" className="block">Settings</Link>
                </div>
            </div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}

export default NavBar