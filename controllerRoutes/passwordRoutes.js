const express = require('express');
const router = express.Router();
const User = require("../model/user");
const {sendResetEmail} = require("../services/emailService");
const validation = require("../middleware/validation");

router.post('/login',async(req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({
            email
        });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        if(user.password !== password){
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        res.status(200).json({
            message: "Login successful"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.post('/addUser',validation, async(req,res)=>{
    try{
        const {email, password} = req.body;

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const  resetToken = Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
        const newUser = new User({
            email,
            password,
            resetToken
        });
        await newUser.save();
        res.status(201).json({
            message: "User created successfully"
        })
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Internal Server Error"
        })

    }
})

router.post('/forgot-password',async (req,res)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({
            email
        });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const  resetToken = Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
        user.resetToken = resetToken;
        await user.save();
        console.log("Generated Reset Token:", user);
        await sendResetEmail(email,resetToken);

        res.status(200).json({
            message: "Password reset email sent"
        })
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.post('/reset-password',async(req,res)=>{
    try{
        const {resetToken,newPassword} = req.body;
        const user = await User.findOne({
            resetToken
        });
        console.log("Reset Token:", resetToken,user);
        if(!user){
            return res.status(404).json({
                message: "Invalid reset token"
            })
        }

        user.password = newPassword;
        console.log("Updated User:", user);
        await user.save();

        res.status(200).json({
            message: "Password reset successful"
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

module.exports = router;