
// ISTO FOI MUDADO - PEDIR BACK E FRONTEND NOVAMENTE AO CHAT:

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Notification schema without content
const NotificationSchema = new Schema({
  noteDate: {
    type: Date,
    required: true
  },
  noticeDate: {
    type: Date,
    required: true
  },
});

// Small notes schema
const SmallNotesSchema = new Schema({
  content: {
    type: String,
    required: false,
    default: undefined
  },
  date: {
    type: Date,
    required: true,
    default: () => Date.now(), // Ensure default is applied only when `date` is not provided
}});

// Library Entry schema
const LibraryEntrySchema = new Schema({
  title: {
    type: String,
    required: false,
    default: undefined
  },
  date: {
    type: Date,
    required: true,
  },
  mainContent: {
    type: String,
    required: false,
    default: undefined
  },
  smallNotes: [SmallNotesSchema],

});

// Support schema

const SupportSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
});

// User schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: false
  },
  library: [LibraryEntrySchema], // Library entries with notifications
  notifications: [NotificationSchema], // Array of notifications
  support: [SupportSchema], // Array of support tickets
}, { timestamps: true });

// Add the comparePassword method - AFTER NEXTAUTH!!! && ADD TO ORIGINAL PROJ ---------------v
//UserSchema.methods.comparePassword = async function(candidatePassword) {
//  return await bcrypt.compare(candidatePassword, this.password);
//};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
