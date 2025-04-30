import app from "./app.js";
import { configDotenv } from "dotenv";
import connectDB from "./src/config/db.js";
configDotenv()
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
console.log(`Server is running on http://localhost:${PORT}`);
 connectDB()
})