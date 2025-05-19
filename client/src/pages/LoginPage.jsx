import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '@/services/authService'

function LoginPage() {

    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleChange = (event) => {
        setForm({
            ...form, [event.target.name]: event.target.value
        })
    }

    const handleLogin = async () => {
        try {
            const { data } = await login({
                email: form.email,
                password: form.password
            })
            localStorage.setItem('token', data.token)
            alert('Loign Successful')
            navigate('/home')
        } catch (error) {
            alert(error.response?.data?.msg || 'Login Failed')
        }
    }

    return (
        <div className='w-screen h-screen flex flex-col'>
            <div className='h-3/5'></div>
            <div className='h-2/5 border-t-5 rounded-t-[50px] p-5 flex flex-col items-center justify-evenly'>
                <p className='font-bold text-lg'>Log in to your account</p>
                <div className='flex flex-col gap-5'>
                    <Input
                        type={"email"}
                        placeholder={"Email Address"}
                        className={"bg-white w-64 h-10 text-sm border-2"}
                        name={'email'}
                        value={form.email}
                        onChange={handleChange}
                    />
                    <Input
                        type={"password"}
                        placeholder={"Password"}
                        className={"bg-white w-64 h-10 text-sm border-2"}
                        name={'password'}
                        value={form.password}
                        onChange={handleChange}
                    />
                </div>
                <Button className={"w-64"} onClick={handleLogin}>Login</Button>
            </div>
        </div>
    )
}

export default LoginPage    