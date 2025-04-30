import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv()
const auth = (req, res, next) => {
  
  const token = req.headers.authorization?.split(' ')[1]

  console.log("Token from auth middleware",token)
  
  if (!token) return res.status(401).send("No token");
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    next();
  } catch(err) {
 
    console.log("Error in middleware:",err.message)
    res.status(401).json({message:"Invalid token",error:err.message});
  }
};

export default auth;
