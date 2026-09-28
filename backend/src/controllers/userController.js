import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

 export const userRegisterController= async (req,res)=>{
  try{
    const {username, email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(existingUser){
        console.log("You are already registered");
         return res.status(409).json({ message: "User already registered"});
    }
    // now for manager role descision
    let role="operator";
    const anyUser= await User.findOne();
    if(!anyUser){
        role="manager";
    }
    const hashedPassword= await bcrypt.hash(password,10); // here password is original password, 10 is no of rounds, hashing will occur
    const newUser= new User({
        username,email,password:hashedPassword,role
    });
    await newUser.save();
    return res.status(201).json({message: "User registered successfully"});
  } catch(error){
       console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
   }
};

export const userLoginController= async (req,res)=>{
       const {email,password}=req.body;
       const user=await User.findOne({email});
       if(!user){
           return res.status(401).json({
            message:"Invalid email or password"
           });
       }
       const  isPasswordCorrect= await bcrypt.compare(password,user.password);
       if(!isPasswordCorrect){
           return res.status(401).json({
            message:"Invalid email or password"
           });
       }
       // now password is correcr, generate JWT token

       const token = jwt.sign(
            { userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
};


