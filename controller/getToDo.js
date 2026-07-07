const ToDo = require('../models/ToDo');

//define route handler
exports.getToDo = async(req, res)=>{

    try{

        //fetch all data
        const todos = await ToDo.find({user: req.user.id});

        //response
        return res.status(200).json({

            success: true,
            data: todos,
            message: 'entire data is fetched'

        })

    }
    catch(err){

        console.error(err);

        return res.status(500).json({
            success: false,
            message: 'server error'
        })

    }

};

exports.getToDoById = async(req, res)=>{

    try{

        const {id} = req.params;
        const todo = await ToDo.findOne({
            _id: id,
            user: req.user.id
        });
        
        //data for given is not found
        if(!todo){

            return res.status(404).json({
                success: false,
                message: 'No data found with given id'
            })

        }

        //jb id mil gyi
        return res.status(200).json({
            success: true,
            data: todo,
            message: `ToDo ${id} data successfully fetched`
        });
        
    }
    catch(err){

        console.error(err);

        return res.status(500).json({

            success: false,
            message: 'server error'

        })

    }

};