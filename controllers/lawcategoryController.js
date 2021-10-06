var LawCategory = require('../models/lawCategory');
var async = require('async');
var Post = require('../models/post');

const { body,validationResult } = require("express-validator");

// Відображення переліку усіх категорій.
exports.lawcategory_list = function(req, res, next) {

  LawCategory.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_lawCategories) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('lawCategory_list', { title: 'Список галузей законодавства', list_lawCategories:  list_lawCategories});
    });

};


// Відображення деталей конкретної категорії.
exports.lawcategory_detail = function(req, res, next) {

  async.parallel({
      lawcategory: function(callback) {

          LawCategory.findById(req.params.id)
            .exec(callback);
      },

      lawcategory_posts: function(callback) {
        Post.find({ 'lawcategory': req.params.id })
        .exec(callback);
      },
      
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.lawcategory==null) { // No results.
          var err = new Error('Категорія не знайдено');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('lawcategory_detail', { title: 'Категорія, деталі', lawcategory: results.lawcategory, lawcategory_posts: results.lawcategory_posts } );
  });

};


// Display Law Category create form on GET.
exports.lawcategory_create_get = function(req, res, next) {
  res.render('lawcategory_form', { title: 'Створення категорії'});
};

// Handle Law Category create on POST.
exports.lawcategory_create_post = [

  // Validate and santise the name field.
  body('name', 'lawcategory name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a lawcategory object with escaped and trimmed data.
      var lawcategory = new LawCategory(
        { name: req.body.name }
      );


      if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          res.render('lawcategory_form', { title: 'Створення категорії', lawcategory: lawcategory, errors: errors.array()});
      return;
      }
      else {
          // Data from form is valid.
          // Check if lawcategory with same name already exists.
          LawCategory.findOne({ 'name': req.body.name })
              .exec( function(err, found_lawcategory) {
                   if (err) { return next(err); }

                   if (found_lawcategory) {
                       // Law Category exists, redirect to its detail page.
                       res.redirect(found_lawcategory.url);
                   }
                   else {

                       lawcategory.save(function (err) {
                         if (err) { return next(err); }
                         // Law Category saved. Redirect to Law Category detail page.
                         res.redirect(lawcategory.url);
                       });

                   }

               });
      }
  }
];

// Display Law Category delete form on GET.
exports.lawcategory_delete_get = function(req, res, next) {

    async.parallel({
        lawcategory: function(callback) {
            LawCategory.findById(req.params.id).exec(callback);
        },
        lawcategory_posts: function(callback) {
            Post.find({ 'lawcategory': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.lawcategory==null) { // No results.
            res.redirect('/catalog/lawCategories');
        }
        // Successful, so render.
        res.render('lawcategory_delete', { title: 'Delete Law Category', lawcategory: results.lawcategory, lawcategory_posts: results.lawcategory_posts } );
    });

};

// Handle Law Category delete on POST.
exports.lawcategory_delete_post = function(req, res, next) {

    async.parallel({
        lawcategory: function(callback) {
            LawCategory.findById(req.params.id).exec(callback);
        },
        lawcategory_posts: function(callback) {
            Post.find({ 'lawcategory': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success        
        if (results.lawcategory_posts.length > 0) {
            // Lawcategory has posts. Render in same way as for GET route.
            res.render('lawcategory_delete', { title: 'Delete Law Category', lawcategory: results.lawcategory, lawcategory_posts: results.lawcategory_posts } );
            return;
        }
        else {
            // Law Category has no posts. // Delete object and redirect to the list of Law Categories.
            LawCategory.findByIdAndRemove(req.body.id, function deleteLawcategory(err) {
                if (err) { return next(err); }
                // Success - go to Law Categories list.
                res.redirect('/catalog/lawCategories');
            });
        }
    });

};

// Display Law Category update form on GET.
exports.lawcategory_update_get = function(req, res, next) {

    LawCategory.findById(req.params.id, function(err, lawcategory) {
        if (err) { return next(err); }
        if (lawcategory==null) { // No results.
            var err = new Error('Law Category not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('lawCategory_form', { title: 'Update Law Category', lawcategory: lawcategory });
    });

};

// Handle Law Category update on POST.
exports.lawcategory_update_post = [
   
    // Validate and sanitze the name field.
    body('name', 'Law Category name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
    

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a Law Category object with escaped and trimmed data (and the old id!)
        var lawcategory = new LawCategory(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('lawCategory_form', { title: 'Update Law Category', lawcategory: lawcategory, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            LawCategory.findByIdAndUpdate(req.params.id, lawcategory, {}, function (err,thelawcategory) {
                if (err) { return next(err); }
                   // Successful - redirect to Law Category detail page.
                   res.redirect(thelawcategory.url);
                });
        }
    }
];
