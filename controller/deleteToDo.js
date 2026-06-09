//import model
const ToDo = require('../models/ToDo');

//define route handler
exports.deleteToDo = async(req, res)=>{

    try{

        const{id} = req.params;
        const deletedTodo = await ToDo.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if(!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'task is deleted'
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