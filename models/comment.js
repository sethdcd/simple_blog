const mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    comment: String,
    author: String
});

module.exports = mongoose.model('Comment', commentSchema);