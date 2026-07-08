const ToDo = require('../models/ToDo');
const WorkspaceMember = require('../models/WorkspaceMember');

exports.createToDo = async (req, res) => {

    try {

        const { title, description, link, dueDate, star, status, priority, workspace } = req.body;

        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: 'title is required'
            });

        }

        let workspaceId = null;

        if (workspace) {

            const member = await WorkspaceMember.findOne({
                workspace,
                user: req.user.id
            });

            if (!member) {

                return res.status(404).json({
                    success: false,
                    message: 'workspace not found'
                });

            }

            if (!member.permissions.canCreate) {

                return res.status(403).json({
                    success: false,
                    message: 'permission denied'
                });

            }

            workspaceId = workspace;

        }

        const todo = await ToDo.create({
            title,
            description,
            link,
            dueDate,
            star,
            status: status || 'Pending',
            priority: priority || 'Medium',
            user: req.user.id,
            workspace: workspaceId
        });

        res.status(200).json({

            success: true,
            todo,
            message: 'todo created successfully'

        });

    }
    catch (err) {

        console.error(err);
        res.status(500).json({
            success: false,
            message: 'internal server error'
        });

    }

};