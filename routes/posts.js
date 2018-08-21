var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
// var flash = require('connect-flash');



/* Create add route */
router.get('/add', function(req, res, next) {
    var categories = db.get('categories');

    categories.find({}, {}, function (err, categories) {
        res.render('addpost',{
            'title': 'Add Post',
            'categories': categories
        })
    });

});

router.post('/add', upload.single('mainImage'), function(req, res, next) {
    // Getting form values
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    // checking Image uplaod
    if (req.file) {
        var mainImage  = req.file.filename;
    }else{
        var mainImage  = "noimage.jpg";
    }

    // form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();

    // Check errors
var errors = req.validationErrors();

    if (errors) {
        res.render('addpost', {
            "errors": errors
        });
    } else {
        var posts = db.get('posts');
        posts.insert({
            "title":title,
            "body": body,
            "category": category,
            "date": date,
            "author": author,
            "mainImage": mainImage
        }, function (err, post) {
            if (err) {
                res.send(err);
            } else{
                req.flash('success', 'Post Added');
                res.location('/');
                res.redirect('/');
            }
        });        
    }

  });

module.exports = router;
