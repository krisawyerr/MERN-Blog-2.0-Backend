let express = require('express')
let app = express()
let mongoose = require('mongoose')
let dotenv = require('dotenv')
let authRoute = require('./routes/auth')
let userRoute = require('./routes/users')
let postRoute = require('./routes/posts')
let commentRoute = require('./routes/comments')
const cookieParser=require('cookie-parser')
const cors=require('cors')
let multer = require('multer')
const path=require("path")

//database
let connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('database is connected!')
    }
    catch(err) {
        console.log(err)
    }
}

//image upload
let storage = multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
    }
})

let upload=multer({storage:storage})

app.post("/api/upload",upload.single("file"),(req,res)=>{
    /* console.log(req.body) */
    res.status(200).json("Image has been uploaded successfully!")
})


app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("app is running on port "+process.env.PORT)
})

//middleware
dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"https://mern-blog-2-0.vercel.app/",credentials:true,methods: ['POST', 'GET', 'PUT', 'DEL']}))
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)

app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`App is running on port ${process.env.PORT}`)
})