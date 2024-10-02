const mongoose = require('mongoose');

/** 
 * Task Manager
 * @param {string} title - Task. This column is required.
 * @param {string} description - Description.
 * @param {date} dueDate - dueDate.
 * @param {string} priority - low or medium or high
 * @param {false} completed - true or false. default is false.
 */
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    dueDate: {
        type: Date,
        default: null,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    },
    completed: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('Sample', TaskSchema)