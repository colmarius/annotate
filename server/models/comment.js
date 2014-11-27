var mongoose = require('mongoose');

module.exports = mongoose.model(
  'Comment',
  (function(Comment) {

    Comment.add({
      domain: {type: String, required: true},
      reference: {type: String, required: true},
      author: {type: String, required: true},
      text: {type: String, required: true},
    });

    Comment.set('toJSON', {
      virtuals: true,
      transform: function(doc, resultDoc) {
        delete resultDoc._id;
        delete resultDoc.__v;
      }
    })

    return Comment;

  })(mongoose.Schema())
);
