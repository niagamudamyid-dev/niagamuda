/* eslint-env node */
/* global process */

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Category from "./models/Category.js";

const MONGO_URI = process.env.MONGO_URI;

let cached = globalThis.mongoose;

if(!cached){
cached = globalThis.mongoose={conn:null};
}

async function connectDB(){

if(cached.conn) return cached.conn;

cached.conn = await mongoose.connect(MONGO_URI,{
bufferCommands:false
});

return cached.conn;

}

function verifyAdmin(req){

const auth=req.headers.authorization;

if(!auth) throw new Error("Unauthorized");

const token=auth.split(" ")[1];

jwt.verify(token,process.env.JWT_SECRET);

}

export default async function handler(req,res){

await connectDB();

const {id}=req.query;

if(req.method==="GET"){

const categories=await Category.find({})
.sort({createdAt:-1});

return res.json(categories);

}

if(req.method==="POST"){

verifyAdmin(req);

const {name,parent}=req.body;

const slug=name
.toLowerCase()
.replace(/\s+/g,"-");

const cat=await Category.create({
name,
slug,
parent:parent||null
});

return res.json(cat);

}

if(req.method==="DELETE"){

verifyAdmin(req);

await Category.findByIdAndDelete(id);

return res.json({message:"deleted"});

}

}
