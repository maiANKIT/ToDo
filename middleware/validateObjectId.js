const mongoose = require('mongoose');

exports.validateObjectId = (...paramNames) => (req, res, next) => {

    for (const param of paramNames) {

        const value = req.params[param];

        if (value && !mongoose.Types.ObjectId.isValid(value)) {

            return res.status(400).json({
                success: false,
                message: `Invalid ${param}`
            });

        }

    }

    next();

};