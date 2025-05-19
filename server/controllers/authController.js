const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password)
        return res.status(400).json({ msg: 'All fields are required' })

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.status(400).json({ msg: 'Email already exists' })

        const hashedPwd = await bcrypt.hash(password, 10)
        const newUser = await User.create({ username, email, password: hashedPwd })

        res.status(201).json({ msg: 'SignUp Successful' })
    } catch (error) {
        res.status(500).json({ msg: 'SignUp Failed', error: error.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).json({ msg: 'All fields are required' })

    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(400).json({ msg: 'User not found' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid credentials' })

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.status(200).json({ msg: 'Login Successful', token })
    } catch (error) {
        res.status(500).json({ msg: 'Login Failed', error: error.message })
    }
}