// var Genre = require('../models/genre');
// var Book = require('../models/book');
var Lpcategory = require('../models/lawProjCategory');
var async = require('async');

const { body,validationResult } = require("express-validator");

// Відображення переліку усіх категорій.
exports.lpCategory_list = function(req, res, next) {

  Lpcategory.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_LPCategories) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('lpCategory_list', { title: 'Список галузей законодавства', list_LPCategories:  list_LPCategories});
    });

};


// Відображення деталей конкретної категорії.
exports.lpcategory_detail = function(req, res, next) {

  async.parallel({
      lpcategory: function(callback) {

          Lpcategory.findById(req.params.id)
            .exec(callback);
      },
      
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.lpcategory==null) { // No results.
          var err = new Error('lpcategory not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('lpcategory_detail', { title: 'lpcategory Detail', lpcategory: results.lpcategory } );
  });

};


// Display lpcategory create form on GET.
exports.lpcategory_create_get = function(req, res, next) {
  res.render('lpcategory_form', { title: 'Створення категорії'});
};

// Handle lpcategory create on POST.
exports.lpcategory_create_post = [

  // Validate and santise the name field.
  body('name', 'lpcategory name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a lpcategory object with escaped and trimmed data.
      var lpcategory = new Lpcategory(
        { name: req.body.name }
      );


      if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          res.render('lpcategory_form', { title: 'Створення категорії', lpcategory: lpcategory, errors: errors.array()});
      return;
      }
      else {
          // Data from form is valid.
          // Check if lpcategory with same name already exists.
          Lpcategory.findOne({ 'name': req.body.name })
              .exec( function(err, found_lpcategory) {
                   if (err) { return next(err); }

                   if (found_lpcategory) {
                       // lpcategory exists, redirect to its detail page.
                       res.redirect(found_lpcategory.url);
                   }
                   else {

                       lpcategory.save(function (err) {
                         if (err) { return next(err); }
                         // lpcategory saved. Redirect to lpcategory detail page.
                         res.redirect(lpcategory.url);
                       });

                   }

               });
      }
  }
];