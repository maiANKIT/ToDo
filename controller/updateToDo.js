const ToDo = require('../models/ToDo');

//define route handler
exports.updateToDo = async(req, res)=>{

    try{

        const {id} = req.params;
        const {title, description, link, dueDate,  star, status, priority} = req.body;

        const todo = await ToDo.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            {
                title,
                description,
                link,
                dueDate,
                star,
                status,
                priority
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

        return res.status(200).json({
            success: true,
            data: todo,
            message: `updated successfully`
        })

    }
    catch(err){

        console.error(err);
        return res.status(500).json({

            success: false,
            message: 'server error'

        })

    }

}

//subtask add
exports.addSubtask = async(req, res)=>{

    try{

        //fetch id
        const {id} = req.params;

        //fetch data
        const{title, description, link, dueDate, status, priority} = req.body;

        //validation
        if(!title || !title.trim()){

            return res.status(400).json({
                success: false,
                message: 'subtask title is required'
            });

        }

        //find todo
        const todo = await ToDo.findOne({
            _id: id,
            user: req.user.id
        });

        //todo not found
        if(!todo){
            
            return res.status(404).json({
                success: false,
                message: 'todo not found'
            });

        }

        //add subtask
        todo.subtasks.push({
            title, description, link, dueDate, status: status || 'Pending', priority: priority || 'Medium', order: todo.subtasks.length
        });

        //save todo
        await todo.save();

        //return response
        return res.status(201).json({
            success: true,
            data: todo,
            message: 'Subtask is added'
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }

}

//update subtask
exports.updateSubtask = async(req, res)=>{

    try{

        //fetch id
        const {todoId, subtaskId} = req.params;

        //fetch data
        const {title, description, link, dueDate, status, priority} = req.body;

        //find todo
        const todo = await ToDo.findOne({
            _id: todoId,
            user: req.user.id
        });

        //todo not found
        if(!todo){
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        //find subtask
        const subtask = todo.subtasks.id(subtaskId);

        //subtask id not found
        if(!subtask){
            return res.status(404).json({
                success: false,
                message: 'subtask not found'
            });
        }

        //update data
        if(title !== undefined) subtask.title = title;
        if(description !== undefined) subtask.description = description;
        if(link !== undefined) subtask.link = link;
        if(dueDate !== undefined) subtask.dueDate = dueDate;
        if(status !== undefined) subtask.status = status;
        if(priority !== undefined) subtask.priority = priority;

        //save
        await todo.save();

        //return response
        return res.status(200).json({
            success: true,
            data: todo,
            message: 'Subtask updated successfully'
        })

    }
    catch(error){

        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }

}

//delete subtask
exports.deleteSubtask = async (req, res)=>{

    try{

        //fetch id
        const {todoId, subtaskId} = req.params;

        //find todo
        const todo = await ToDo.findOne({
            _id: todoId,
            user: req.user.id
        });

        //todo not found
        if(!todo){
            return res.status(404).json({
                success: false,
                message: 'todo not found'
            })
        }

        //find subtask
        const subtask = todo.subtasks.id(subtaskId);

        //subtask not found
        if(!subtask){
            return res.status(404).json({
                success: false,
                message: 'subtask not found'
            });
        }

        //delete subtask
        subtask.deleteOne();

        //reorder
        todo.subtasks.forEach((subtask, index)=>{
            subtask.order = index;
        });

        //save todo
        await todo.save();

        //return response
        return res.status(200).json({
            success: true,
            data: todo,
            message: 'Subtask deleted successfully'
        })

    }
    catch(error){

        return res.status(500).json({
            success: false,
            message: 'internal server error'
        })

    }

}