const mongoose = require('mongoose');

const FlowSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Renewed', 'Not Renewed'],
    default: 'Pending'
  },
  logs: [{
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  reminderCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'flows'  // collection name
});

// Validate before saving
FlowSchema.pre('save', function (next) {
  if (this.reminderCount > 2) {
    this.status = 'Not Renewed';
  }
  next();
});

FlowSchema.statics.findOrCreateFlow = async function (userId) {
  let flow = await this.findOne({ userId, status: 'Pending' });

  if (!flow) {
    flow = new this({
      userId,
      logs: [{ message: 'Flow initiated' }],
      status: 'Pending'
    });
    await flow.save();
  }

  return flow;
};

const Flow = mongoose.model('Flow', FlowSchema);

module.exports = Flow;
