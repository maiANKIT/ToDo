const ToDo = require('../models/ToDo');
const WorkspaceMember = require('../models/WorkspaceMember');
const resolveTaskAccess = require('../utils/resolveTaskAccess');

exports.getToDo = async (req, res) => {

    try {

        const { workspace } = req.query;

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

            if (!member.permissions.canView) {

                return res.status(403).json({
                    success: false,
                    message: 'permission denied'
                });

            }

            const todos = await ToDo.find({ workspace })
                .populate('user', 'name email')
                .sort({ createdAt: -1 });

            return res.status(200).json({

                success: true,
                data: todos,
                message: 'workspace tasks fetched successfully'

            });

        }

        const todos = await ToDo.find({
            user: req.user.id,
            workspace: null
        });

        return res.status(200).json({

            success: true,
            data: todos,
            message: 'entire data is fetched'

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

exports.getToDoById = async (req, res) => {

    try {

        const { id } = req.params;

        const todo = await ToDo.findById(id);

        if (!todo) {

            return res.status(404).json({
                success: false,
                message: 'No data found with given id'
            });

        }

        const access = await resolveTaskAccess(todo, req.user.id);

        if (!access.allowed) {

            return res.status(404).json({
                success: false,
                message: 'No data found with given id'
            });

        }

        return res.status(200).json({
            success: true,
            data: todo,
            message: `ToDo ${id} data successfully fetched`
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