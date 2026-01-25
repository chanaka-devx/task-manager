const mongoose = require('mongoose');

const todoItemSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const todoListSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    items: [todoItemSchema]
  },
  { timestamps: true }
);

// Index for faster queries
todoListSchema.index({ userId: 1 });

module.exports = mongoose.model('TodoList', todoListSchema);
