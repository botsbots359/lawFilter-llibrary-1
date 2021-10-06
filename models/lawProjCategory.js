var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LpcategorySchema = new Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 100}
});

// Virtual for this genre instance URL.
LpcategorySchema
.virtual('url')
.get(function () {
  return '/catalog/lpcategory/'+this._id;
});

// Export model.
module.exports = mongoose.model('Lpcategory', LpcategorySchema);
