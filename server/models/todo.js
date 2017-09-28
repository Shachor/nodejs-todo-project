const mongoose = require('mongoose');

// Mongoose like order, so we create models of our collection data
var Todo = mongoose.model('Todo', {
    text: {
       type: String,
       required: true,
       minlength: 1,
       trim: true        // Removes leading and trailing whitespace
    },
    completed: {
       type: Boolean,
       default: false
    },
    completedAt: {
       type: Number,
       default: null,
    },
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
   }
});


module.exports = {Todo};
