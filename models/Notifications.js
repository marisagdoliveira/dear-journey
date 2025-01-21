// models/Notification.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Notifications Schema
const NotificationsSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.models.Notifications || mongoose.model('Notifications', NotificationsSchema);