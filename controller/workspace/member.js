const Workspace = require("../../models/Workspace");
const WorkspaceMember = require("../../models/WorkspaceMember");

const getPermissionsByRole = require("../../utils/rolePermissions");

exports.getWorkspaceMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await WorkspaceMember.findOne({
        workspace: id,
        user: req.user.id,
        });

        if (!member) {
        return res.status(404).json({
            success: false,
            message: "Workspace not found",
        });
        }

        if (!member.permissions.canView) {
        return res.status(403).json({
            success: false,
            message: "Permission denied",
        });
        }

        const workspace = await Workspace.findById(id);

        if (!workspace) {
        return res.status(404).json({
            success: false,
            message: "Workspace not found",
        });
        }

        const members = await WorkspaceMember.find({
        workspace: id,
        })
        .populate("user", "name email")
        .sort({
            createdAt: 1,
        });

        return res.status(200).json({
        success: true,
        data: members,
        message: "Workspace members fetched successfully",
        });


  } 
  catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.changeMemberRole = async (req, res) => {

    try {

        const { workspaceId, memberId } = req.params;

        const { role } = req.body;

        if (!role || !role.trim()) {

            return res.status(400).json({
                success: false,
                message: "Role is required"
            });

        }

        const allowedRoles = ["Admin", "Editor", "Contributor", "Viewer"];

        if (!allowedRoles.includes(role.trim())) {

            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });

        }

        const currentMember = await WorkspaceMember.findOne({

            workspace: workspaceId,
            user: req.user.id

        });

        if (!currentMember) {

            return res.status(404).json({

                success: false,
                message: "Workspace not found"

            });

        }

        if (!currentMember.permissions.canManageMembers) {

            return res.status(403).json({

                success: false,
                message: "Permission denied"

            });

        }

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {

            return res.status(404).json({

                success: false,
                message: "Workspace not found"

            });

        }

        const targetMember = await WorkspaceMember.findById(memberId);

        if (!targetMember) {

            return res.status(404).json({

                success: false,
                message: "Member not found"

            });

        }

        if (targetMember.workspace.toString() !== workspaceId) {

            return res.status(400).json({
                success: false,
                message: "Member does not belong to this workspace"
            });

        }

        if (targetMember.user.toString() === req.user.id) {

            return res.status(400).json({
                success: false,
                message: "You cannot change your own role"
            });

        }

        if (targetMember.role === "Owner") {

            return res.status(403).json({
                success: false,
                message: "Owner role cannot be changed"
            });

        }

        if (role === "Owner") {

            return res.status(403).json({
                success: false,
                message: "Owner role cannot be assigned"
            });

        }

        if (targetMember.role === role) {

            return res.status(409).json({
                success: false,
                message: "Member already has this role"
            });

        }

        targetMember.role = role;

        targetMember.permissions = getPermissionsByRole(role);

        await targetMember.save();

        return res.status(200).json({

            success: true,
            data: targetMember,
            message: "Member role updated successfully"

        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};

exports.removeMember = async (req, res) => {

    try {

        const { workspaceId, memberId } = req.params;

        const currentMember = await WorkspaceMember.findOne({

            workspace: workspaceId,
            user: req.user.id

        });

        if (!currentMember) {

            return res.status(404).json({
                success: false,
                message: "Workspace not found"
            });

        }

        if (!currentMember.permissions.canManageMembers) {

            return res.status(403).json({
                success: false,
                message: "Permission denied"
            });

        }

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {

            return res.status(404).json({
                success: false,
                message: "Workspace not found"
            });

        }

        if (workspace.isArchived) {

            return res.status(409).json({
                success: false,
                message: "Workspace is archived"
            });

        }

        const targetMember = await WorkspaceMember.findById(memberId);

        if (!targetMember) {

            return res.status(404).json({
                success: false,
                message: "Member not found"
            });

        }

        if (targetMember.workspace.toString() !== workspaceId) {

            return res.status(400).json({
                success: false,
                message: "Member does not belong to this workspace"
            });

        }

        if (targetMember.user.toString() === req.user.id) {

            return res.status(400).json({
                success: false,
                message: "You cannot remove yourself"
            });

        }

        if (targetMember.role === "Owner") {

            return res.status(403).json({
                success: false,
                message: "Owner cannot be removed"
            });

        }

        await targetMember.deleteOne();

        return res.status(200).json({

            success: true,
            message: "Member removed successfully"

        });


    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};

exports.leaveWorkspace = async (req, res) => {

    try {

        const { workspaceId } = req.params;

        const member = await WorkspaceMember.findOne({

            workspace: workspaceId,
            user: req.user.id

        });

        if (!member) {

            return res.status(404).json({

                success: false,
                message: "Workspace not found"

            });

        }

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {

            return res.status(404).json({

                success: false,
                message: "Workspace not found"

            });

        }

        if (member.role === "Owner") {

            return res.status(403).json({

                success: false,
                message: "Owner cannot leave the workspace. Transfer ownership first."

            });

        }

        await member.deleteOne();

        return res.status(200).json({

            success: true,
            message: "You left the workspace successfully"

        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};