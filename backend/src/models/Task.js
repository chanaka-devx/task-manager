const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    topic: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true, 
      trim: true 
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high'], 
      default: 'medium' 
    },
    status: { 
      type: String, 
      enum: ['scheduled', 'inProgress', 'done'], 
      default: 'scheduled' 
    },
    date: { 
      type: Date, 
      required: true 
    },
    dueDate: { 
      type: Date 
    }
  },
  { timestamps: true }
);

// Index for faster queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Task', taskSchema);
