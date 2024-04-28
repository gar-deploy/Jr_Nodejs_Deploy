
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    }
},
    { timestamps: true });


const fileModel = mongoose.model("File", fileSchema)

export default fileModel;

