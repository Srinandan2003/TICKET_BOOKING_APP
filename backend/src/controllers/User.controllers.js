
import bcrypt from 'bcrypt';

import User from "../models/User.models.js";
import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
configDotenv()


export const Register = async(req, res) =>{
    const {name, email, password} = req.body;
    const saltRounds = process.env.SALT_ROUNDS;
    try{
        if(!name || !email || !password) return res.status(400).json({message:"Invalid fields"}); // invalid fields
        
        const user =  await User.findOne({email});  
        if(user) {  // check existence of the user 
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(+saltRounds)
const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = await User.create({name,email,password:hashedPassword});

        console.log("New User : ",newUser);
        res.status(201).json({message:"Account created successfully, Please login"})
    }catch(error){
console.log("Error in register controller:",error.message);
res.status(400).json({message:"Something went wrong please try again..."});
    } 
}

export const LogIn = async (req,res) =>{
const {email, password} = req.body;
console.log("Secret in login controller:", process.env.SECRET_KEY);
    try {
        if(!email || !password) return res.status(400).json({message:"Invalid fields"});

  const user = await User.findOne({email});
  if(!user) return res.status(400).json({message:"User not found please Register"});

  const checkPassword = await bcrypt.compare(password, user.password);
  if(!checkPassword) return res.status(400).json({message:"Incorrect password"})

const token = jwt.sign({userId:user._id,userName:user.name},process.env.SECRET_KEY);
res.status(200).json({message :"Logged in sucessfully",token:token,userId: user._id});


    } catch (error) {
        console.log("Error in logIn controller:",error.message);
        res.status(400).json({message:"Something went wrong"});
    }
}