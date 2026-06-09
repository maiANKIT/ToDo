const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.auth = (req, res, next)=>{

    try{

        const token = req.cookies?.token || req.body?.token || req.header('Authorization')?.replace('Bearer ', '');

        console.log("Authorization:", req.header("Authorization"));
        console.log("Token:", token);

        if(!token){

            return res.status(401).json({

                success: false,
                message: 'token missing'

            });

        }

        //verify token
        try{

            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload;

        }
        catch(err){

            console.error(err);
            return res.status(401).json({

                success: false,
                message: 'token is invalid'

            });

        }

        next();
        
    }
    catch(err){

        return res.status(500).json({

            success: false,
            message: 'server error'

        })

    }

}