const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide an amount']
  },
  type: {
    type: String,
    required: [true, 'Please provide a record type'],
    enum: ['income', 'expense']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'] // e.g., 'Salary', 'Groceries', 'Rent'
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Please provide a date']
  },
  notes: {
    type: String,
    maxlength: 500
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Record', recordSchema);
