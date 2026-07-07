const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true,
        default:""
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    avatar:{
        type: String,
        trim: true,
        default: null
    },
    isArchived:{
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model('Workspace', workspaceSchema);