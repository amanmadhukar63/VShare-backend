import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB= async ()=>{
    try{
        const connectionInst=await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`);
        console.log('DB connected succesfully!!! DB_Host:',connectionInst.connection.host)
    }
    catch(error){
        console.error("Error in connecting DB :",error);
        process.exit(1);
    }
}

export default connectDB;