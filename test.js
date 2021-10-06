async.parallel({
    book_count: function(callback) {
        Book.countDocuments({},callback);
    },
}, function(err, results) {
    res.render('index', { title: 'Local Library Home', error: err, data: results });
});
};