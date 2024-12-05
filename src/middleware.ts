import {Request,Response,NextFunction} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const isLoggedIn = (req : Request,res : Response,next : NextFunction) => {
    try {
    const token = req.headers["token"];
    if(!process.env.JWT_SECRET){
        res.status(498).send("SECRET KEY ERROR");
        return;
    }
    const decodedData = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload ;
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

export default isLoggedIn;