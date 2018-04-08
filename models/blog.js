const mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    createdOn: {type: Date, default: Date.now},
    title: String,
    body: String,
    author: String,
    category: String,
    image: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Blog', blogSchema);