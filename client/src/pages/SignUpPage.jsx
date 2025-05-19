import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signup } from '@/services/authService'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SignUpPage() {

    const [form, setForm] = useState({
        username: '',
        email: '',
        createPassword: '',
        confirmPassword: ''
    })
    const navigate = useNavigate()

    const handleChange = (event) => {
        setForm({
            ...form, [event.target.name]: event.target.value
        })
    }

    const handleSignUp = async () => {
        if (form.createPassword !== form.confirmPassword)
            return alert("Passwords don't match")
        try {
            await signup({
                username: form.username,
                email: form.email,
                password: form.confirmPassword
            })
            alert('Sign Up Successful')
            navigate('/login')
        } catch (error) {
            console.log(form)
            alert(error.response?.data?.msg || 'Sign Up Failed')
        }
    }

    return (
        <div className='w-screen h-screen flex flex-col'>
            <div className='h-1/3'></div>
            <div className='h-2/3 border-t-5 rounded-t-[50px] p-5 flex flex-col justify-evenly items-center'>
                <p className='font-bold text-lg'>Create an account</p>
                <div className='flex flex-col items-center gap-5'>
                    <Input
                        type={"text"}
                        placeholder={"User Name"}
                        className={"bg-white h-10 w-64 text-sm border-2"}
                        name={'username'}
                        value={form.username}
                        onChange={handleChange}
                    />
                    <Input
                        type={"email"}
                        placeholder={"Email Addresss"}
                        className={"bg-white h-10 w-64 text-sm border-2"}
                        name={'email'}
                        value={form.email}
                        onChange={handleChange}
                    />
                    <Input
                        type={"password"}
                        placeholder={"Create Password"}
                        className={"bg-white h-10 w-64 text-sm border-2"}
                        name={'createPassword'}
                        value={form.createPassword}
                        onChange={handleChange}
                    />
                    <Input
                        type={"password"}
                        placeholder={"Confirm Password"}
                        className={"bg-white h-10 w-64 text-sm border-2"}
                        name={'confirmPassword'}
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <Button className={"w-48"} onClick={handleSignUp}>Create Account</Button>
            </div>
        </div>
    )
}

export default SignUpPage