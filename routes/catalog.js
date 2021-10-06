var express = require('express');
var router = express.Router();


// Require our controllers.
var book_controller = require('../controllers/bookController'); 
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');
var law_proj_category_controller = require('../controllers/lawProjCategoryController');
var law_category_controller = require('../controllers/lawcategoryController');
var post_controller = require('../controllers/postController');


/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', book_controller.index);  

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

// GET request for list of all Book.
router.get('/books', book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);


/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

// POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);


/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance.
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);


/// МАРШРУТИ КАТЕГОРІЙ ///
// GET запит для отримання переліку всіх категорій.
router.get('/list_LPCategories', law_proj_category_controller.lpCategory_list);

// GET request for creating a lpcategory. NOTE This must come before route that displays lpcategory (uses id).
router.get('/lpcategory/create', law_proj_category_controller.lpcategory_create_get);

// GET запит для отримання однієї категорії.
router.get('/lpcategory/:id', law_proj_category_controller.lpcategory_detail);

// POST request for creating lpcategory.
router.post('/lpcategory/create', law_proj_category_controller.lpcategory_create_post);

/// LAW CATEGORY ROUTES ///

// GET request for creating a Lawcategory. NOTE This must come before route that displays Lawcategory (uses id).
router.get('/lawCategory/create', law_category_controller.lawcategory_create_get);

// POST request for creating Lawcategory.
router.post('/lawCategory/create', law_category_controller.lawcategory_create_post);

// GET request to delete Lawcategory.
router.get('/lawCategory/:id/delete', law_category_controller.lawcategory_delete_get);

// POST request to delete Lawcategory.
router.post('/lawCategory/:id/delete', law_category_controller.lawcategory_delete_post);

// GET request to update Lawcategory.
router.get('/lawCategory/:id/update', law_category_controller.lawcategory_update_get);

// POST request to update Lawcategory.
router.post('/lawCategory/:id/update', law_category_controller.lawcategory_update_post);

// GET request for one Lawcategory.
router.get('/lawCategory/:id', law_category_controller.lawcategory_detail);

// GET request for list of all Law Categories.
router.get('/lawCategories', law_category_controller.lawcategory_list);


/// POST ROUTES ///

// GET request for creating a Post. NOTE This must come before route that displays Post (uses id).
router.get('/post/create', post_controller.post_create_get);

// POST request for creating Post.
router.post('/post/create', post_controller.post_create_post);

// GET request to delete Post.
router.get('/post/:id/delete', post_controller.post_delete_get);

// POST request to delete Post.
router.post('/post/:id/delete', post_controller.post_delete_post);

// GET request to update Post.
router.get('/post/:id/update', post_controller.post_update_get);

// POST request to update Post.
router.post('/post/:id/update', post_controller.post_update_post);

// GET request for one Post.
router.get('/post/:id', post_controller.post_detail);

// GET request for list of all Posts.
router.get('/posts', post_controller.post_list);


module.exports = router;
