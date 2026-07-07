const express = require("express");

const { auth } = require("../middleware/auth");

const { createWorkspace } = require("../controller/workspace/createWorkspace");

const {
    getWorkspaces,
    getWorkspaceById
} = require("../controller/workspace/getWorkspace");

const { updateWorkspace } = require("../controller/workspace/updateWorkspace");

const { archiveWorkspace } = require("../controller/workspace/archiveWorkspace");

const { restoreWorkspace } = require("../controller/workspace/restoreWorkspace");

const {
    inviteMember,
    acceptInvitation,
    rejectInvitation,
    getWorkspaceInvitations
} = require("../controller/workspace/invitation");

const {
    getWorkspaceMembers,
    changeMemberRole,
    removeMember,
    leaveWorkspace
} = require("../controller/workspace/member");

const router = express.Router();

// workspace
router.post("/", auth, createWorkspace);

router.get("/", auth, getWorkspaces);

router.get("/:id", auth, getWorkspaceById);

router.put("/:id", auth, updateWorkspace);

router.patch("/:id/archive", auth, archiveWorkspace);

router.patch("/:id/restore", auth, restoreWorkspace);

// invitation
router.post("/:id/invite", auth, inviteMember);

router.post("/invite/:token/accept", auth, acceptInvitation);

router.post("/invite/:token/reject", auth, rejectInvitation);

router.get("/:id/invitations", auth, getWorkspaceInvitations);

// members
router.get("/:id/members", auth, getWorkspaceMembers);

router.patch(
    "/:workspaceId/member/:memberId/role",
    auth,
    changeMemberRole
);

router.delete(
    "/:workspaceId/member/:memberId",
    auth,
    removeMember
);

router.delete(
    "/:workspaceId/leave",
    auth,
    leaveWorkspace
);

module.exports = router;