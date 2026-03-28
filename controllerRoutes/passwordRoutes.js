const express = require('express');
const router = express.Router();
const User = require("../model/user");
const {sendResetEmail} = require("../services/emailService");
const validation = require("../middleware/validation");
const bcrypt = require('bcrypt');

// If you want to use JWT, uncomment the next line and install jsonwebtoken
// const jwt = require('jsonwebtoken');


router.post('/addUser', validation, async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const newUser = new User({
            email,
            password: hashedPassword,
            resetToken
        });
        await newUser.save();
        res.status(201).json({
            message: "User created successfully"
        });
    } catch (error) {
        console.error("[ADD_USER] Error creating user:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

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

        const resetToken = Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
        user.resetToken = resetToken;
        await user.save();
        
        // Send response IMMEDIATELY - don't wait for email at all
        res.status(200).json({
            message: "Password reset email sent"
        })
        
        // Send email completely in background
        setImmediate(async () => {
            try {
                await sendResetEmail(email, resetToken);
            } catch (err) {
                console.error(`[EMAIL] Error sending to ${email}:`, err.message);
            }
        });
        
    }catch(err){
        console.error('[FORGOT-PASSWORD] Error:', err);
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
        
        if(!user){
            return res.status(404).json({
                message: "Invalid reset token"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password reset successful"
        })

    }
    catch(err){
        console.error('[RESET-PASSWORD] Error:', err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error('[LOGIN] Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;