const mongoose = require('mongoose');

const workspaceMemberSchema = new mongoose.Schema({

    workspace:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role:{
        type: String,
        enum: ['Owner', 'Admin', 'Editor', 'Contributor', 'Viewer'],
        default: 'Viewer'
    },
    permissions:{

        canView: {
            type: Boolean,
            default: true
        },
        canCreate:{
            type: Boolean,
            default: false
        },
        canEdit:{
            type: Boolean,
            default: false
        },
        canDelete:{
            type: Boolean,
            default: false
        },
        canAssign:{
            type: Boolean,
            default: false
        },
        canInvite:{
            type: Boolean,
            default: false
        },
        canManageMembers:{
            type: Boolean,
            default: false
        },
        canManageWorkspace:{
            type: Boolean,
            default: false
        },
        canComment:{
            type: Boolean,
            default: false
        }

    },
    joinedAt:{
        type: Date,
        default: Date.now
    }

},
{
    timestamps: true
});

workspaceMemberSchema.index(
    {
        workspace: 1,
        user: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model('WorkspaceMember', workspaceMemberSchema);