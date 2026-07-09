const express = require("express");

const { auth } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validateObjectId");

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
    getInvitationByToken,
    getMyInvitations,
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

router.get("/:id", auth, validateObjectId("id"), getWorkspaceById);

router.put("/:id", auth, validateObjectId("id"), updateWorkspace);

router.patch("/:id/archive", auth, validateObjectId("id"), archiveWorkspace);

router.patch("/:id/restore", auth, validateObjectId("id"), restoreWorkspace);

// invitation
router.post("/:id/invite", auth, validateObjectId("id"), inviteMember);

router.get("/invite/:token", auth, getInvitationByToken);

router.get("/invitations/mine", auth, getMyInvitations);

router.post("/invite/:token/accept", auth, acceptInvitation);

router.post("/invite/:token/reject", auth, rejectInvitation);

router.get("/:id/invitations", auth, validateObjectId("id"), getWorkspaceInvitations);

// members
router.get("/:id/members", auth, validateObjectId("id"), getWorkspaceMembers);

router.patch(
    "/:workspaceId/member/:memberId/role",
    auth,
    validateObjectId("workspaceId", "memberId"),
    changeMemberRole
);

router.delete(
    "/:workspaceId/member/:memberId",
    auth,
    validateObjectId("workspaceId", "memberId"),
    removeMember
);

router.delete(
    "/:workspaceId/leave",
    auth,
    validateObjectId("workspaceId"),
    leaveWorkspace
);

module.exports = router;