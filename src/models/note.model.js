import mongoose, { mongo } from "mongoose";

const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    content:{
        type: String,
        required: [true, "content is required"],
    },
}, {
    timestamps: true
});

const Note = mongoose.model("Note", noteSchema)
export default Note;