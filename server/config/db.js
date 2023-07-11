import mongoose from "mongoose";

const connectDB = async (DATABASE_URI) => {
    try {
        const DB_OPTION = {
            dbName: "memories"
        }
        await mongoose.connect(DATABASE_URI, DB_OPTION)
        console.log("Connected...")
    } catch (err) {
        console.log(err)
    }
}

export default connectDB;