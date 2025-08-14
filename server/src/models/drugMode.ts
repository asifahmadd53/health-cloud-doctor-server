import mongoose from "mongoose";

const drugModeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

export default mongoose.model("drugMode",drugModeSchema);