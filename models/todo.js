// Load required packages
var mongoose = require('mongoose');

// Define our todo schema
var TodoSchema = new mongoose.Schema({
  name: String,
  description: String,
  priority: Number,
  subtasks: [{ subtask: String, done: Boolean }],
  dateAdded: { type: Date, default: Date.now },
  dateToDo: { type: Date, default: Date.now },
  done: Boolean,
  comments: [{ comment: String}]
});

// Export the Mongoose model
module.exports = mongoose.model('Todo', TodoSchema);