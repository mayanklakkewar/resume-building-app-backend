import mongoose from "mongoose";

export const connectDB = async function(req,res){
    await mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB connected Sucessfully"))
      .catch((e) => console.error(e));
}

