let express = require('express')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let router = express.Router()
let User = require('../models/User')

//register
router.post("/register", async (req, res) => {
    try {
        let {username, email, password} = req.body
        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hashSync(password, salt)
        let newUser = new User({username, email, password:hashedPassword})
        let savedUser = await newUser.save()
        res.status(200).json(savedUser)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({email:req.body.email})
        if (!user) {
            return res.status(404).json('User not found!')
        }
        let match = await bcrypt.compare(req.body.password, user.password)
        if (!match) {
            return res.status(401).json('Wrong Password!')
        }

        let token=jwt.sign({_id:user._id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:"3d"})
        let {password, ...info} = user._doc
        res.cookie('token', token).status(200).json(info)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//logout
router.get("/logout", async (req, res) => {
    try {
        res.clearCookie('token', {sameSite: 'none', secure: true}).status(200).json('User logged out!')
    }
    catch(err){
        res.status(500).json(err)
    }
})

//refetch user
router.get("/refetch", (req, res) => {
    const token=req.cookies.token
    jwt.verify(token,process.env.SECRET,{},async (err,data)=>{
        if(err){
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})

module.exports = router