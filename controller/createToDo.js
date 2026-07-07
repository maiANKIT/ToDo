//import model
const ToDo = require('../models/ToDo');

exports.createToDo = async(req, res)=>{

    try{

        //title and description
        const {title, description, link, dueDate, star, status, priority} = req.body;

        //validation
        if(!title || !title.trim()){

            return res.status(400).json({
                success: false,
                message: 'title is required'
            });

        }

        //create a new todo and insert inside the body
        const todo = await ToDo.create({title, description, link, dueDate, star, status: status || 'Pending', priority: priority || 'Medium', user: req.user.id});

        //success
        res.status(200).json({

            success: true,
            todo,
            message: 'todo created successfully'
            
        });

    }
    catch(err){

        console.error(err);
        res.status(500).json({
            success: false,
            message: 'internal server error'
        });

    }

}