const Workspace = require('../../models/Workspace');
const WorkspaceMember = require('../../models/WorkspaceMember');

exports.updateWorkspace = async (req, res) => {

    try {

        const { id } = req.params;
        const { name, description, avatar } = req.body;

        const member = await WorkspaceMember.findOne({
            workspace: id,
            user: req.user.id
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'workspace not found'
            });
        }

        if (!member.permissions.canManageWorkspace) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied'
            });
        }

        const workspace = await Workspace.findById(id);

        if (!workspace) {
            return res.status(404).json({
                success: false,
                message: 'workspace not found'
            });
        }

        if (workspace.isArchived) {
            return res.status(409).json({
                success: false,
                message: 'Archived workspace cannot be updated'
            });
        }

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'workspace name is required'
                });
            }
            workspace.name = name.trim();
        }

        if (description !== undefined) {
            workspace.description = description?.trim?.() ?? description;
        }

        if (avatar !== undefined) {
            workspace.avatar = avatar?.trim?.() ?? avatar;
        }

        await workspace.save();

        return res.status(200).json({
            success: true,
            data: workspace,
            message: 'workspace updated successfully'
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