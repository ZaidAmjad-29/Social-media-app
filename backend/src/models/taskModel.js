
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a task title"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please provide a task description"],
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
    dueDate: {
        type: Date,
        required: [true, "Please provide a due date for the task"],
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
    },
    }, {
    timestamps: true,
    });

    const Task = mongoose.model("Task", taskSchema);
    module.exports = Task;