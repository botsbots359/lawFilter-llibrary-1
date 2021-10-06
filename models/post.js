var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
    // name: {type: String, required: true, minlength: 3, maxlength: 100},
    title: {type: String, required: true},
    content: {type: String, required: true},
    lawcategory: [{ type: Schema.ObjectId, ref: 'LawCategory' }]
});

// Virtual for this Post instance URL.
PostSchema
.virtual('url')
.get(function () {
  return '/catalog/post/'+this._id;
});

// Export model.
module.exports = mongoose.model('Post', PostSchema);
