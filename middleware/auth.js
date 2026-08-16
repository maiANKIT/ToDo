const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

require('dotenv').config();

exports.auth = async (req, res, next)=>{

    try{

        const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

        if(!token){

            return res.status(401).json({

                success: false,
                message: 'token missing'

            });

        }

        //verify token
        try{

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

        }
        catch(error){

            console.error(error);
            return res.status(401).json({

                success: false,
                message: 'token is invalid'

            });

        }

        //device limit
        const activeSession = await Session.findOne({token: token});

        if(!activeSession){

            return res.status(401).json({
                success: false,
                message: 'Session expired, You are logged out because of login from another device'
            });

        }

        next();
        
    }
    catch(error){

        console.error(error);

        return res.status(500).json({

            success: false,
            message: 'server error'

        })

    }

}