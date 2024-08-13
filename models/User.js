const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Small notes schema:

const SmallNotesSchema = new Schema({
  content: {
    type: String,
    required: false,
    default: undefined
  },
});

// Library Entry schema:

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


// User schema:

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
  library: [LibraryEntrySchema],

}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
