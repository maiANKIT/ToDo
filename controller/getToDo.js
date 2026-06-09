const ToDo = require('../models/ToDo');

//define route handler
exports.getToDo = async(req, res)=>{

    try{

        //fetch all data
        const todos = await ToDo.find({user: req.user.id});

        //response
        res.status(200).json({

            success: true,
            data: todos,
            message: 'entire data is fetched'

        })

    }
    catch(err){

        console.error(err);
        console.log("GET TODO ERROR");

        res.status(500).json({
            success: false,
            error: err.message,
            message: 'server error'
        })

    }

};

exports.getToDoById = async(req, res)=>{

    try{

        const id = req.params.id;
        const todo = await ToDo.findById(id);
        
        //data for given is not found
        if(!todo){

            return res.status(404).json({
                success: false,
                message: 'No data found with given id'
            })

        }

        //jb id mil gyi
        res.status(200).json({
            success: true,
            data: todo,
            message: `ToDo ${id} data successfully fetched`
        });
        
    }
    catch(err){

        console.error(err);
        console.log("GET TODO ERROR");

        res.status(500).json({

            success: false,
            error: err.message,
            message: 'server error'

        })

    }

};