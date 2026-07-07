const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({

    workspace:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    invitedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    role:{
        type: String,
        enum: ['Admin', 'Editor', 'Contributor', 'Viewer'],
        default: 'Viewer'
    },
    token:{
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: String,
        enum:['Pending', 'Accepted', 'Rejected', 'Expired'],
        default: 'Pending'
    },
    expiresAt:{
        type: Date,
        required: true
    }

},
{
    timestamps: true
});

invitationSchema.index(
    {
        workspace: 1,
        email: 1
    },
    {
        unique: true
    }
)

module.exports = mongoose.model('Invitation', invitationSchema);