import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    image: String,
  },
  { timestamps: true }
);

const Book =
  mongoose.models.Book ||
  mongoose.model("Book", BookSchema);

export default Book;