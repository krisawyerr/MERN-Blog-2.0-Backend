const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')


//CREATE
router.post("/create", verifyToken, async (req,res)=>{
    try{
        let newPost=new Post(req.body)
        let savedPost=await newPost.save()
        
        res.status(200).json(savedPost)
    }
    catch(err){
        
        res.status(500).json(err)
    }
     
})

//update
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedUser=await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedUser)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//delete
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({postId: req.params.id})
        res.status(200).json("Post has been deleted!")
    }
    catch(err){
        res.status(500).json(err)
    }
})

//get post details
router.get("/:id", async (req, res) => {
    try {
        let post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//get all posts
router.get("/", async (req, res) => {
    let query = req.query

    try {
        let searchFilter = {
            title: {$regex: query.search, $options:"i"}
        }

        let posts = await Post.find(query.search ? searchFilter:null)
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//get user posts
router.get("/user/:userId", async (req, res) => {
    try {
        let posts = await Post.find({userId: req.params.userId})
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})



module.exports = router