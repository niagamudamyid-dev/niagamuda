import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
{
title:String,
price:Number,
image:String,
public_id:String,

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
