const crypto = require("crypto");
const mongoose = require("mongoose");

const User = require("../../models/User");
const Workspace = require("../../models/Workspace");
const WorkspaceMember = require("../../models/WorkspaceMember");
const Invitation = require("../../models/Invitation");
const getPermissionsByRole = require('../../utils/rolePermissions');
const mailSender = require("../../utils/mailSender");
const workspaceInvitationTemplate = require("../../templates/workspaceInvitation");

exports.inviteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const { email, role } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }

    const member = await WorkspaceMember.findOne({
      workspace: id,
      user: req.user.id,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "workspace not found",
      });
    }

    if (!member.permissions.canInvite) {
      return res.status(403).json({
        success: false,
        message: "permission denied",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "workspace not found",
      });
    }

    if (workspace.isArchived) {
      return res.status(409).json({
        success: false,
        message: "workspace is archived",
      });
    }

    if (normalizedEmail === req.user.email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "you cannot invite yourself",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (user) {
      const existingMember = await WorkspaceMember.findOne({
        workspace: id,
        user: user._id,
      });

      if (existingMember) {
        return res.status(409).json({
          success: false,
          message: "user is already a workspace member",
        });
      }
    }

    // The {workspace, email} pair is unique at the DB level (one row per
    // pair, any status) — so re-inviting after a Reject/Expire must reuse
    // and reset the same row instead of creating a new document.
    const existingInvitation = await Invitation.findOne({
      workspace: id,
      email: normalizedEmail,
    });

    if (existingInvitation && existingInvitation.status === "Pending") {
      return res.status(409).json({
        success: false,
        message: "invitation already sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let invitation;

    if (existingInvitation) {

      existingInvitation.invitedBy = req.user.id;
      existingInvitation.role = role || "Viewer";
      existingInvitation.token = token;
      existingInvitation.status = "Pending";
      existingInvitation.expiresAt = expiresAt;

      invitation = await existingInvitation.save();

    } else {

      invitation = await Invitation.create({
        workspace: id,
        invitedBy: req.user.id,
        email: normalizedEmail,
        role: role || "Viewer",
        token,
        expiresAt,
      });

    }

    const inviter = await User.findById(req.user.id).select("name");

    const inviterName = inviter?.name || "A TodoFlow user";

    const acceptUrl = `${process.env.FRONTEND_URL}/invite/${token}`;

    await mailSender(

        normalizedEmail,

        `Invitation to join ${workspace.name}`,

        workspaceInvitationTemplate({

            invitedBy: inviterName,

            workspaceName: workspace.name,

            role: invitation.role,

            acceptUrl

        })

    );

    return res.status(201).json({
      success: true,

      data: invitation,

      // token,

      message: "invitation created successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getInvitationByToken = async (req, res) => {

    try {

        const { token } = req.params;

        const invitation = await Invitation.findOne({ token })
            .populate("workspace", "name description isArchived")
            .populate("invitedBy", "name");

        if (!invitation) {

            return res.status(404).json({
                success: false,
                message: "invitation not found"
            });

        }

        // only the invited email can preview this invitation
        if (req.user.email.toLowerCase() !== invitation.email) {

            return res.status(403).json({
                success: false,
                message: "this invitation does not belong to your account"
            });

        }

        // lazily mark expired invites
        if (invitation.status === "Pending" && invitation.expiresAt < new Date()) {

            invitation.status = "Expired";
            await invitation.save();

        }

        return res.status(200).json({

            success: true,

            data: {
                workspaceName: invitation.workspace?.name,
                workspaceDescription: invitation.workspace?.description,
                workspaceArchived: invitation.workspace?.isArchived,
                invitedByName: invitation.invitedBy?.name,
                role: invitation.role,
                status: invitation.status,
                email: invitation.email,
                expiresAt: invitation.expiresAt
            },

            message: "invitation fetched successfully"

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

// Invitations addressed to the logged-in user's email, across ALL workspaces —
// powers the navbar notification bell.
exports.getMyInvitations = async (req, res) => {

    try {

        const invitations = await Invitation.find({
            email: req.user.email.toLowerCase(),
            status: "Pending",
            expiresAt: { $gt: new Date() }
        })
        .populate("workspace", "name isArchived")
        .populate("invitedBy", "name")
        .sort({ createdAt: -1 });

        // skip invites whose workspace got archived in the meantime
        const active = invitations.filter(
            (inv) => inv.workspace && !inv.workspace.isArchived
        );

        return res.status(200).json({

            success: true,
            data: active,
            message: "invitations fetched successfully"

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

exports.acceptInvitation = async (req, res) => {

    try {

        const { token } = req.params;

        //invitation
        const invitation = await Invitation.findOne({
            token
        });

        if (!invitation) {

            return res.status(404).json({
                success: false,
                message: "invitation not found"
            });

        }

        //check status
        if (invitation.status !== "Pending") {

            return res.status(409).json({
                success: false,
                message: `invitation is ${invitation.status.toLowerCase()}`
            });

        }

        //check expiry
        if (invitation.expiresAt < new Date()) {

            invitation.status = "Expired";

            await invitation.save();

            return res.status(410).json({
                success: false,
                message: "Invitation has expired"
            });

        }

        // email match
        if (req.user.email.toLowerCase() !== invitation.email) {

            return res.status(403).json({
                success: false,
                message: "this invitation does not belong to your account"
            });

        }

        const workspace = await Workspace.findById(invitation.workspace);

        if (!workspace) {

            return res.status(404).json({
                success: false,
                message: "workspace not found"
            });

        }

        if (workspace.isArchived) {

            return res.status(409).json({
                success: false,
                message: "workspace is archived"
            });

        }

        // already member
        const existingMember = await WorkspaceMember.findOne({

            workspace: invitation.workspace,
            user: req.user.id

        });

        if (existingMember) {

            return res.status(409).json({

                success: false,
                message: "you are already a workspace member"

            });

        }

        const session = await mongoose.startSession();

        try {

            session.startTransaction();

            //create workspace member
            await WorkspaceMember.create([
                {
                    workspace: invitation.workspace,
                    user: req.user.id,
                    role: invitation.role,
                    permissions: getPermissionsByRole(invitation.role)
                }
            ], { session });

            //update status
            invitation.status = "Accepted";

            await invitation.save({ session });

            await session.commitTransaction();

            session.endSession();

            return res.status(200).json({

                success: true,
                message: "invitation accepted successfully"

            });

        }
        catch (error) {

            if (session.inTransaction()) {

                await session.abortTransaction();

            }

            session.endSession();

            throw error;

        }

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal server error"

        });

    }

};

exports.rejectInvitation = async (req, res) => {

    try {

        const { token } = req.params;

        const invitation = await Invitation.findOne({
            token
        });

        if (!invitation) {

            return res.status(404).json({
                success: false,
                message: "invitation not found"
            });

        }

        if (invitation.status !== "Pending") {

            return res.status(409).json({
                success: false,
                message: `invitation is ${invitation.status.toLowerCase()}`
            });

        }

        if (invitation.expiresAt < new Date()) {

            invitation.status = "Expired";

            await invitation.save();

            return res.status(410).json({
                success: false,
                message: "Invitation has expired"
            });

        }

        if (req.user.email.toLowerCase() !== invitation.email) {

            return res.status(403).json({
                success: false,
                message: "this invitation does not belong to your account"
            });

        }

        invitation.status = "Rejected";

        await invitation.save();

        return res.status(200).json({

            success: true,
            message: "invitation rejected successfully"

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

exports.getWorkspaceInvitations = async (req, res) => {

    try {

        const { id } = req.params;
        const member = await WorkspaceMember.findOne({

            workspace: id,
            user: req.user.id

        });

        if (!member) {

            return res.status(404).json({

                success: false,
                message: "workspace not found"

            });

        }

        if (!member.permissions.canInvite) {

            return res.status(403).json({

                success: false,
                message: "permission denied"

            });

        }

        const workspace = await Workspace.findById(id);

        if (!workspace) {

            return res.status(404).json({

                success: false,
                message: "workspace not found"

            });

        }

        const invitations = await Invitation.find({

            workspace: id

        })
        .populate("invitedBy", "name email")
        .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            data: invitations,

            message: "workspace invitations fetched successfully"

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