import mongoose from 'mongoose'

const connectDB = async () =>{

    try {
    const DB = await mongoose.connect(process.env.MONGO_DB_URI);
console.log("DB connected : ",DB.connections[0].host);

    } catch (error) {
        console.log("DB Not connected: ",error.message);
    }
}

export default connectDB;