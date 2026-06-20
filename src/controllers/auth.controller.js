import userModel from "../models/user.model.js";
import crypto, { hash } from "crypto";
import jwt from "jsonwebtoken"; 
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import Note from "../models/note.model.js";
import { ref } from "process";


export async function register(req, res){
    const {username, email, password} = req.body;
    
    const isAlreadyRegistered = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    });

    if(isAlreadyRegistered){
        return res.status(409).json({
            message: "username or email already exists"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    
    const refreshToken = jwt.sign(
        {   id:user._id    }, 
        config.JWT_SECRET,
        {   expiresIn:"7d"    }
    )
    
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })


    const accessToken = jwt.sign(
        {   id:user._id,
            sessionId: session._id
            }, 
        config.JWT_SECRET,
        {   expiresIn:"15m"    }
    )
    
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7*60*60*24*1000
    })

    res.status(201).json({
        message: "user registered successfully:)",
        user:{
            username: user.username,
            email: user.email,
        },
        accessToken
    })
}

export async function login(req, res){
    const {email, password} = req.body;
    const user = await userModel.findOne({
        email
    });
    if(!user){
        return res.status(401).json({
            message: "invalid email or password"
        })
    }
    
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const isPasswordValid = hashedPassword === user.password;
    if(!isPasswordValid){
        return res.status(401).json({
            message: "invalid email or password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id
        }, config.JWT_SECRET, 
        {
            expiresIn: "7d"
        })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET,{
        expiresIn:"15m"
    })
    res.cookie("refreshToken", refreshToken,{
        httpOnly:true,
        secure: false,
        sameSite: "strict",
        maxAge: 7*24*3600*1000
    })
    res.status(200).json({
        message: "Logged in successfully",
        user: {
            username: user.username,
            email: user.email
        },
        accessToken
    })
}

export async function getMe(req, res){

    try{

        const token =
            req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message:"token not found"
            });
        }

        const decoded =
            jwt.verify(token, config.JWT_SECRET);

        const user =
            await userModel.findById(decoded.id);

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        res.status(200).json({
            message:"User fetched successfully",
            username:user.username,
            email:user.email
        });

    }
    catch(err){

        return res.status(401).json({
            message:"Invalid or expired token"
        });

    }
}

export async function refreshToken(req,res){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            message: "Refresh token not found"
        });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })
    if(!session){
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }

    const accessToken = jwt.sign({
        id: decoded.id,
    }, config.JWT_SECRET,{
        expiresIn:"15m"
    })

    const newRefreshToken = jwt.sign({
        id: decoded.id,
    }, config.JWT_SECRET, {   expiresIn:"7d"    })

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")
    session.refreshTokenHash = newRefreshTokenHash

    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7*60*60*24*1000
    })

    res.status(200).json({
        message:"Access token refreshed successfully",
        accessToken
    })
}

export async function logout(req, res){

    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh token not formed",
        })
    }

    const refreshTokenHash =  crypto.createHash("sha256").update(refreshToken).digest("hex")

     // DEBUG
    console.log("Cookie token:", refreshToken);
    console.log("Cookie hash:", refreshTokenHash);

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    //DEBUG
    console.log("Session found:", session);

    if(!session){
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken")

    res.status(200).json({
        message: "logged out successfully"
    })
}

export async function logoutAll(req,res){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh Token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    })

    res.clearCookie("refreshToken")
    res.status(200).json({
        message: "Logged out from all devices successfully"
    })
}


export async function createNote(req, res){
    try{
        const {title, content} = req.body;
        if(!title || !content){
            return res.status(400).json({
                message:"Title and content are required"
            })
        }
        const newNote = new Note({title, content})
        await newNote.save();
        res.status(201).json(newNote)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
export async function getNotes(req, res){
    try{
        const notes = await Note.find().sort({createdAt:-1})
        res.status(200).json(notes)

    }catch(error){
        res.status(500).json({message:error.message})
    }
}
export async function updateNote(req, res){
    try{
        const {title, content} = req.body;
        const updateNote = await Note.findByIdAndUpdate(req.params.id, {title, content}, 
            {new:true}
        )
        if(!updateNote){
            return res.status(400).json({
                message:"Could not Update"
            })
        }
        res.send(201).json(updateNote)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
export async function deleteNote(req, res){
    try{
        const deleteNote = await Note.findByIdAndDelete(req.params.id)
        if(!deleteNote){
            return res.status(400).json({
                message:"Note not found"
            })
        }
        res.send(201).json(deleteNote)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}