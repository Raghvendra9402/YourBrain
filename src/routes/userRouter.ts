import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Models from "../db";
import isLoggedIn from "../middleware";
const userRouter = Router();

userRouter.post("/signup", async (req,res) => {
    const {email,username, password} = req.body;
    const user = await Models.UserModel.findOne({username});
    if(user){
        res.status(403).send({message : "user already exists"});
        return;
    }
    const hashedPassword = await bcrypt.hash(password,10);
    Models.UserModel.create({
        email,
        username,
        password : hashedPassword
    });
    res.status(200).send({message : "User Created Successfully"})
});

userRouter.post("/signin", async  (req,res) => {
    const {username , password} = req.body;
    const user = await Models.UserModel.findOne({username});
    if(!user || !password || !user.password){
        res.status(401).send({message : "Please Enter valid username and password"})
        return;
    }
    const validPassword = await bcrypt.compare(password,user.password);
    if(!validPassword){
        res.status(403).send({message : "Invalid Credentials"})
        return;
    }
    if(!process.env.JWT_SECRET){
        throw new Error("SECRET KEY ERROR");
    }
    const token = jwt.sign({id : user._id},process.env.JWT_SECRET);
    res.status(200).json({
        message : `Welcome ${user.username}`,
        "id" : user._id,
        "token" : token
    })
});
//@ts-ignore

userRouter.post("/content",isLoggedIn,async  (req,res) => {
    const userId = req.id; // to solve id issues i created a types.d.ts please take a look at that file
    const {link , type ,title, tags } = req.body;
    await Models.ContentModel.create({
        link,
        type,
        title,
        tags,
        userId : userId
    });
    res.status(200).send({message : "content created successfully"})
});

userRouter.get("/content",isLoggedIn,async(req,res) => {
    const userId = req.id;
    const contents = await Models.ContentModel.findOne({userId}).populate("userId","username");
    if(!contents) {
        res.status(404).send({message : "user contents not found"});
        return;
    }
    res.json({
        contents
    })
});

userRouter.delete("/content",isLoggedIn,async (req,res) => {
    try{
    const userId = req.id;
    const contentId = req.body.contentId;
    
    const deletedContent =await Models.ContentModel.findByIdAndDelete({
        _id : contentId,
        userId
    });
    if(!deletedContent){
        res.status(404).send({message : "NO content found"})
    }
    res.status(200).json({
        message : "deleted!!!",
        deletedContent

    })
}catch(e) {
    console.log("Error On delete Content");
    res.status(500).json({
        message : "ERROR"
    })
}
})

export default userRouter;