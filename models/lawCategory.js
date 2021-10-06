var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LawCategorySchema = new Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 100}
});

// Virtual for this Law Category instance URL.
LawCategorySchema
.virtual('url')
.get(function () {
  return '/catalog/lawCategory/'+this._id;
});

// Export model.
module.exports = mongoose.model('LawCategory', LawCategorySchema);
