const ToDo = require('../models/ToDo');
const resolveTaskAccess = require('../utils/resolveTaskAccess');

exports.updateToDo = async (req, res) => {

    try {

        const { id } = req.params;
        const { title, description, link, dueDate, star, status, priority } = req.body;

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

        if (todo.workspace && !access.member.permissions.canEdit) {

            return res.status(403).json({
                success: false,
                message: 'permission denied'
            });

        }

        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (link !== undefined) todo.link = link;
        if (dueDate !== undefined) todo.dueDate = dueDate;
        if (star !== undefined) todo.star = star;
        if (status !== undefined) todo.status = status;
        if (priority !== undefined) todo.priority = priority;

        await todo.save();

        return res.status(200).json({
            success: true,
            data: todo,
            message: `updated successfully`
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

//subtask add
exports.addSubtask = async (req, res) => {

    try {

        const { id } = req.params;
        const { title, description, link, dueDate, status, priority } = req.body;

        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: 'subtask title is required'
            });

        }

        const todo = await ToDo.findById(id);

        if (!todo) {

            return res.status(404).json({
                success: false,
                message: 'todo not found'
            });

        }

        const access = await resolveTaskAccess(todo, req.user.id);

        if (!access.allowed) {

            return res.status(404).json({
                success: false,
                message: 'todo not found'
            });

        }

        if (todo.workspace && !access.member.permissions.canEdit) {

            return res.status(403).json({
                success: false,
                message: 'permission denied'
            });

        }

        todo.subtasks.push({
            title, description, link, dueDate, status: status || 'Pending', priority: priority || 'Medium', order: todo.subtasks.length
        });

        await todo.save();

        return res.status(201).json({
            success: true,
            data: todo,
            message: 'Subtask is added'
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

};

//update subtask
exports.updateSubtask = async (req, res) => {

    try {

        const { todoId, subtaskId } = req.params;
        const { title, description, link, dueDate, status, priority } = req.body;

        const todo = await ToDo.findById(todoId);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        const access = await resolveTaskAccess(todo, req.user.id);

        if (!access.allowed) {

            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });

        }

        if (todo.workspace && !access.member.permissions.canEdit) {

            return res.status(403).json({
                success: false,
                message: 'permission denied'
            });

        }

        const subtask = todo.subtasks.id(subtaskId);

        if (!subtask) {
            return res.status(404).json({
                success: false,
                message: 'subtask not found'
            });
        }

        if (title !== undefined) subtask.title = title;
        if (description !== undefined) subtask.description = description;
        if (link !== undefined) subtask.link = link;
        if (dueDate !== undefined) subtask.dueDate = dueDate;
        if (status !== undefined) subtask.status = status;
        if (priority !== undefined) subtask.priority = priority;

        await todo.save();

        return res.status(200).json({
            success: true,
            data: todo,
            message: 'Subtask updated successfully'
        });

    }
    catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });

    }

};

//delete subtask
exports.deleteSubtask = async (req, res) => {

    try {

        const { todoId, subtaskId } = req.params;

        const todo = await ToDo.findById(todoId);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'todo not found'
            });
        }

        const access = await resolveTaskAccess(todo, req.user.id);

        if (!access.allowed) {

            return res.status(404).json({
                success: false,
                message: 'todo not found'
            });

        }

        if (todo.workspace && !access.member.permissions.canEdit) {

            return res.status(403).json({
                success: false,
                message: 'permission denied'
            });

        }

        const subtask = todo.subtasks.id(subtaskId);

        if (!subtask) {
            return res.status(404).json({
                success: false,
                message: 'subtask not found'
            });
        }

        subtask.deleteOne();

        todo.subtasks.forEach((sub, index) => {
            sub.order = index;
        });

        await todo.save();

        return res.status(200).json({
            success: true,
            data: todo,
            message: 'Subtask deleted successfully'
        });

    }
    catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'internal server error'
        });

    }

};