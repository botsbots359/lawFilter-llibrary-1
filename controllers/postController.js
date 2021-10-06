var Post = require('../models/post');
var LawCategory = require('../models/lawCategory');
var async = require('async');

const { body,validationResult } = require("express-validator");

// Відображення переліку усіх категорій.
exports.post_list = function(req, res, next) {

  Post.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_posts) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('post_list', { title: 'Список дописів', list_posts:  list_posts});
    });

};


// Відображення деталей конкретного допису.
exports.post_detail = function(req, res, next) {

  async.parallel({
      post: function(callback) {

          Post.findById(req.params.id)
            .populate('lawcategory')
            .exec(callback);
      },
      
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.post==null) { // No results.
          var err = new Error('Допис не знайдено');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('post_detail', { title: 'Допис, деталі', post: results.post } );
  });

};


// Display Post create form on GET.
exports.post_create_get = function(req, res, next) {

    // Отримання всіх юр.категорій, які ми можемо використати для додавання до нашого допису.
    async.parallel({
        lawcategories: function(callback) {
            LawCategory.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('post_form', { title: 'Створення допису', lawcategories:results.lawcategories });
    });
};

// Handle Post create on POST.
exports.post_create_post = [

    // Перетворення категорії в масив.
    (req, res, next) => {
        if(!(req.body.lawcategory instanceof Array)){
            if(typeof req.body.lawcategory==='undefined')
            req.body.lawcategory=[];
            else
            req.body.lawcategory=new Array(req.body.lawcategory);
        }
        next();
    },

  // Validate and santise the name field.
  body('title', 'Заголовок не має бути пустим.').trim().isLength({ min: 1 }).escape(),
  body('content', 'Текст не має бути пустим.').trim().isLength({ min: 1 }).escape(),
  body('lawcategory.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a post object with escaped and trimmed data.
      var post = new Post(
        { title: req.body.title,
          content: req.body.content,
          lawcategory: req.body.lawcategory
         }
      );


      if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.

            // Отримання всіх категорій для форми.
            async.parallel({
                lawcategories: function(callback) {
                    LawCategory.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Відмітити наші обрані категорії як відмічені.
                for (let i = 0; i < results.lawcategories.length; i++) {
                    if (post.lawcategory.indexOf(results.lawcategories[i]._id) > -1) {
                        results.lawcategories[i].checked='true';
                    }
                }          
                res.render('post_form', { title: 'Створення допису', post: post, lawcategories:lawcategories, errors: errors.array()});
            });
            return;
      }
      else {
          // Data from form is valid.
          // Check if post with same name already exists.
          Post.findOne({ 'title': req.body.title })
              .exec( function(err, found_post) {
                   if (err) { return next(err); }

                   if (found_post) {
                       // Post exists, redirect to its detail page.
                       res.redirect(found_post.url);
                   }
                   else {

                       post.save(function (err) {
                         if (err) { return next(err); }
                         // Post saved. Redirect to Post detail page.
                         res.redirect(post.url);
                       });

                   }

               });
      }
  }
];

// Display Post delete form on GET.
exports.post_delete_get = function(req, res, next) {

    async.parallel({
        post: function(callback) {
            Post.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.post==null) { // No results.
            res.redirect('/catalog/posts');
        }
        // Successful, so render.
        res.render('post_delete', { title: 'Delete Post', post: results.post } );
    });

};

// Handle Post delete on POST.
exports.post_delete_post = function(req, res, next) {

    async.parallel({
        post: function(callback) {
            Post.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
            // Delete object and redirect to the list of Posts.
            Post.findByIdAndRemove(req.body.id, function deletePost(err) {
                if (err) { return next(err); }
                // Success - go to Posts list.
                res.redirect('/catalog/posts');
            });
    });

};

// Display Post update form on GET.
exports.post_update_get = function(req, res, next) {

    // Get post and categories for form.
    async.parallel({
        post: function(callback) {
            Post.findById(req.params.id).populate('lawcategory').exec(callback);
        },
        lawcategories: function(callback) {
            LawCategory.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.post==null) { // No results.
                var err = new Error('Post not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected lawcategories as checked.
            for (var all_l_iter = 0; all_l_iter < results.lawcategories.length; all_l_iter++) {
                for (var post_l_iter = 0; post_l_iter < results.post.lawcategory.length; post_l_iter++) {
                    if (results.lawcategories[all_l_iter]._id.toString()===results.post.lawcategory[post_l_iter]._id.toString()) {
                        results.lawcategories[all_l_iter].checked='true';
                    }
                }
            }
            res.render('post_form', { title: 'Update Post', lawcategories:results.lawcategories, post: results.post });
        });

};


//     Post.findById(req.params.id, function(err, post) {
//         if (err) { return next(err); }
//         if (post==null) { // No results.
//             var err = new Error('Post not found');
//             err.status = 404;
//             return next(err);
//         }
//         // Success.
//         res.render('post_form', { title: 'Оновлення допису', post: post });
//     });

// };

// Handle Post update on POST.
exports.post_update_post = [
   
    // Validate and sanitze the name field.
    body('name', 'Post name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
    

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a Post object with escaped and trimmed data (and the old id!)
        var post = new Post(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('post_form', { title: 'Update Post', post: post, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Post.findByIdAndUpdate(req.params.id, post, {}, function (err,thepost) {
                if (err) { return next(err); }
                   // Successful - redirect to Post detail page.
                   res.redirect(thepost.url);
                });
        }
    }
];
