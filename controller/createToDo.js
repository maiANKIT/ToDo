//import model
const ToDo = require('../models/ToDo');

exports.createToDo = async(req, res)=>{

    try{

        //title and description
        const {title, description, link, dueDate, star, status} = req.body;

        //create a new todo and insert inside the body
        const response = await ToDo.create({title, description, link, dueDate, star, status: status || 'pending', user: req.user.id});

        //success
        res.status(200).json({

            success: true,
            data: response,
            message: 'entry checked'
            
        });

    }
    catch(err){

        console.error(err);
        console.log(err);
        res.status(500).json({
            success: false,
            data: 'internal server error',
            message: err.message
        });

    }

}