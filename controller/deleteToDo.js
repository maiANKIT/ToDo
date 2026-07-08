const ToDo = require('../models/ToDo');
const resolveTaskAccess = require('../utils/resolveTaskAccess');

exports.deleteToDo = async (req, res) => {

    try {

        const { id } = req.params;

        const todo = await ToDo.findById(id);

        if (!todo) {

            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });

        }

        const access = await resolveTaskAccess(todo, req.user.id);

        if (!access.allowed) {

            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });

        }

        if (todo.workspace && !access.member.permissions.canDelete) {

            return res.status(403).json({
                success: false,
                message: 'permission denied'
            });

        }

        await todo.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'todo is deleted'
        });

    }
    catch (err) {

        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'server error'
        });

    }

};