import { Router } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import Models from "../db";
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
async function isLoggedIn(req,res,next) {
    try {
    const token = req.headers.token;
    if(!process.env.JWT_SECRET){
        res.status(498).send("SECRET KEY ERROR");
        return;
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload ;
    if(!decodedData) {
    res.status(401).send({message : "Authorization Failed"});
    return;
    }
    req.id = decodedData.id;
    next();
    }catch(e){
        console.log("Error");
    }
}
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
    const contents = await Models.ContentModel.findOne({userId});
    if(!contents) {
        res.status(404).send({message : "user contents not found"});
        return;
    }
    res.json({
        contents
    })
});

export default userRouter;