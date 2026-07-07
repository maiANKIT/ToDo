const getPermissionsByRole = (role) => {

    switch (role) {

        case 'Owner':
            return {
                canView: true,
                canCreate: true,
                canEdit: true,
                canDelete: true,
                canAssign: true,
                canInvite: true,
                canManageMembers: true,
                canManageWorkspace: true,
                canComment: true
            };

        case 'Admin':
            return {
                canView: true,
                canCreate: true,
                canEdit: true,
                canDelete: true,
                canAssign: true,
                canInvite: true,
                canManageMembers: true,
                canManageWorkspace: false,
                canComment: true
            };

        case 'Editor':
            return {
                canView: true,
                canCreate: true,
                canEdit: true,
                canDelete: false,
                canAssign: true,
                canInvite: false,
                canManageMembers: false,
                canManageWorkspace: false,
                canComment: true
            };

        case 'Contributor':
            return {
                canView: true,
                canCreate: true,
                canEdit: false,
                canDelete: false,
                canAssign: false,
                canInvite: false,
                canManageMembers: false,
                canManageWorkspace: false,
                canComment: true
            };

        case 'Viewer':
        default:
            return {
                canView: true,
                canCreate: false,
                canEdit: false,
                canDelete: false,
                canAssign: false,
                canInvite: false,
                canManageMembers: false,
                canManageWorkspace: false,
                canComment: true
            };

    }

};

module.exports = getPermissionsByRole;