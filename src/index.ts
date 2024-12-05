import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import userRouter from "./routes/userRouter";
import brainRouter from "./routes/brainRouter";

dotenv.config();
if(!process.env.DATABASE_URL){
    throw new Error("DATABSE_URL is invalid")  
}
mongoose.connect(process.env.DATABASE_URL).then(() => {console.log("database connected successfully")});
const app = express();
app.use(express.json());

app.use("/api/v1/user" , userRouter);
app.use("/api/v1/brain", brainRouter);

app.listen(3000,() => {console.log("listening on port 3000");
})
