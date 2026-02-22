import express from "express";
import {z} from "zod";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import dns from "node:dns/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import {User} from "./db.js";

mongoose.connect(process.env.MONGO_URL!)
.then(()=>{
    console.log("Mongoose connection sucessful");
})
.catch((e)=>{
    console.log("Error caught");
    console.log(e);
})

const app=express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.json({
        msg:"Helo"
    })
});

app.post("/signup",async (req,res)=>{
    const {username,email,password} =req.body;
    const requiredBody=z.object({
        username:z.string(),
        email:z.email(),
        password:z.string()
    });
    const success=requiredBody.safeParse(req.body);
    if(!success){
        res.json({
            msg:"coundnt login"
        })
    }else{
        const hashedPassword=await bcrypt.hash(password,5);
        await User.create({
            username:username,
            email:email,
            password:hashedPassword
        })
        res.json({
            msg: "hi login successful",
            
        });
    }
})

app.post("/signin",async (req,res)=>{
    const {username,email,password}=req.body;
    const user=await User.findOne({
        username:username
    });
    const checkUnhashedPassword=await bcrypt.compare(password,user!.password);
    if(!checkUnhashedPassword){
        res.status(401).json({
            msg:"Wrong password or username"
        });
    }else{
        const token=jwt.sign({
            username:username,
            date:new Date()
        },process.env.JWT_SECRET!);
        res.json({
            token
        })
    }
})

app.listen(3000);