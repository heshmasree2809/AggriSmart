const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    index: true 
  },
  roles: [String],
  type: {
    type: String,
    enum: ['Alert', 'Reminder', 'Update', 'Warning', 'Info', 'Success', 'Error'],
    default: 'Info'
  },
  category: {
    type: String,
    enum: ['Weather', 'Pest', 'Disease', 'Price', 'Order', 'Irrigation', 'System', 'Scheme'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: mongoose.Schema.Types.Mixed,
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  read: { type: Boolean, default: false },
  readAt: Date,
  actionRequired: { type: Boolean, default: false },
  actionUrl: String,
  expiresAt: Date,
  deliveryChannels: [{
    type: String,
    enum: ['InApp', 'Email', 'SMS', 'Push']
  }],
  deliveryStatus: {
    inApp: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  }
}, { timestamps: true });

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ roles: 1, read: 1 });
NotificationSchema.index({ category: 1, priority: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
