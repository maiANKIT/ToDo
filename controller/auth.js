const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//signup router handler
exports.signup = async(req, res)=>{

    try{

        //get data
        const {name, email, password} = req.body;

        //check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: 'email already exist'
            });
        }

        //secure password
        let hashedPassword;

        try{
            hashedPassword = await bcrypt.hash(password, 10)
        }
        catch(err){

            return res.status(400).json({
                success: false,
                message: 'error while hashing'
            })

        }

        //create entry for user
        const user = await User.create({
            name, email, password: hashedPassword
        });

        return res.status(200).json({
            success: true,
            message: 'User created successfully',
            user
        });

    }
    catch(err){

        console.error(err);

        return res.status(500).json({

            success: false,
            message: 'user cannot be registered please try again'

        })

    }
    
}

//login
exports.login = async(req, res)=>{

    try{

        //fetch data
        const {email, password} = req.body;

        //validation
        if(!email || !password){

            return res.status(400).json({
                success: false,
                message: 'Please fill all the details'
            });

        }

        let user = await User.findOne({ email });

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered'
            });
        }

        const payload = {
            email: user.email,
            id: user._id
        }

        //verify password and generate token
        if(await bcrypt.compare(password, user.password)){

            //match password
            let token = jwt.sign(payload, process.env.JWT_SECRET, {

                expiresIn: '30d'
                
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 30*24*60*60*1000),
                httpOnly: true
            }

            res.cookie('token', token, options).status(200).json({

                success: true,
                token,
                user,
                message: 'User logged in successfully'

            })

        }
        else{

            //password donot match
            return res.status(403).json({
                success: false,
                message: 'incorrect password'
            })

        }

    }
    catch(err){
        console.error(err);
        return res.status(500).json({

            success: false,
            message: 'login failed'

        });
    }

}