const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true,
        maxLength: 500
    },
    description:{
        type: String,
        required: true,
        maxLength: 1000
    },
    status:{
        type: String,
        enum: ['pending', 'done', 'inprogress'],
        default: 'pending'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        required: true,
        default: Date.now
    }

});

module.exports = mongoose.model('ToDo', todoSchema);