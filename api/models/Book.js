import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
{
title:String,
price:Number,
image:String,
public_id:String,

description: String,
author: String,
isbn: String,
publisher: String,
publishDate: String,
pages: String,
weight: String,
coverType: String,
dimension: String,
bonus: String,
language: String,
stock: Number,
shopeeLink: String,


slug:{
type:String,
unique:true
}, 

category:{
type:String,
required:true
},

subcategory:{
type:String,
default:null
}

},
{timestamps:true}
);

const Book =
mongoose.models.Book ||
mongoose.model("Book",BookSchema);

export default Book;
