const mongoose = require('mongoose');

//subtask

const subTaskSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true,
        trim: true
    },

    description:{
        type: String,
        trim: true
    },

    link:{
        type: String,
        trim: true,
        default: null
    },

    dueDate:{
        type: Date,
        default: null
    },
    status:{
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },

    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', "Critical"],
        default: 'Medium'
    },
    order: {
        type: Number,
        default: 0
    }

},
{
    timestamps: true
});

//task
const todoSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    status:{
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    star:{
        type: Boolean,
        default: false
    },
    link:{
        type: String,
        trim: true,
        default: null
    },
    dueDate:{
        type: Date,
        default: null
    },
    priority:{

        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium"

    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workspace:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        default: null
    },
    subtasks: {
        type: [subTaskSchema],
        default: []
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('ToDo', todoSchema);