import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

//Generate a token JWT
const generateToken = (userId) =>{
    return jwt.sign({id : userId}, process.env.JWT_SECRET,{expiresIn : '7d'})
}


export const registerUser = async function(req,res){
    try {
        const {name,email,password} = req.body

        //check if user exists or not
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).json({
                message : "User Already Exists"
            })
        }
        if(password.length < 8){
            return res.status(400).json({
                success : false,
                message : "Password should be atlest 8 Charactors"
            })
        }

        // Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        //Create a User
        const user = await User.create({
            name,
            email,
            password : hashedPassword
        })

        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({
            message : "Server error",
            error: error.message
        })
    }
}

//Login Function
export const loginUser = async (req,res)=>{
    try {
        const {email,password } = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message:"Invalid email or password"})
        }

        //Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password"})

        }

        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({
            message : "Server error",
            error: error.message
        })
    }
}

//GetUser Profile Fuction
export const getUserProfile = async function(req,res){
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({
                message : "User not Found"
            })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({
            message : "Server error",
            error: error.message
        })
    }
}