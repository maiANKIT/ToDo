const ToDo = require('../models/ToDo');

//define route handler
exports.updateToDo = async(req, res)=>{

    try{

        const {id} = req.params;
        const {title, description, status} = req.body;

        const todo = await ToDo.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            {
                title,
                description,
                status,
                updatedAt: Date.now()
            },
            {
                new: true
            }
        );

        if(!todo){

            return res.status(404).json({
                success: false,
                message: 'Task not found'
            })

        }

        res.status(200).json({
            success: true,
            data: todo,
            message: `updated successfully`
        })

    }
    catch(err){

        console.error(err);
        res.status(500).json({

            success: false,
            error: err.message,
            message: 'server error'

        })

    }

}