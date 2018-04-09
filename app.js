/* App Variables
***************************************************/
const methodOverride = require("method-override"),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      express        = require("express"),
      app            = express();
      
      
/* DB Config
***************************************************/  
const Comment = require("./models/comment"),
      Blog    = require("./models/blog");
      
mongoose.connect('mongodb://localhost:27017/simple_blog');


/* App Config
***************************************************/
console.log(__dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');


/* Index Routes
***************************************************/
/* Home Route
*******************/
app.get('/', function(req, res) {
    res.redirect('/blogs');
});

/* Index Route
*******************/
app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log('Error: ' + err);
        } else {
            res.render('blogs/index', {blogs: blogs});
        }
    });
    
});

/* New Route
*******************/
app.get('/blogs/new', function(req, res) {
    res.render('blogs/new');
});

/* Create Route
*******************/
app.post('/blogs', function(req, res) {
    Blog.create(req.body.blog, function(err, blogPost) {
        if(err) {
            console.log('Error: ' + err);
            res.render('blogs/new');
        } else {
            res.redirect('/blogs');
        }
    });
});


/* Show Route
*******************/
app.get('/blogs/:id', function(req, res) {
    Blog.findById(req.params.id).populate('comments').exec(function(err, foundPost) {
        if(err) {
            console.log('Error: ' + err);
            res.redirect('/blogs');
        } else {
            res.render('blogs/show', {blog: foundPost});
        }
    });
});

/* Edit Route
*******************/
app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, blogPost) {
        if(err) {
            console.log('Error: ' + err);
            res.redirect('/blogs');
        } else {
            res.render('blogs/edit', {blog: blogPost});
        }
    });
});

/* Update Route
*******************/
app.put('/blogs/:id', function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, editPost) {
        if(err) {
            console.log('Error: ' + err);
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});


/* Delete Route
*******************/
app.delete('/blogs/:id', function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log('Error: ' + err);
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});


/* Comment Routes
***************************************************/
/* New Route
*******************/
app.get('/blogs/:id/comments/new', function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log('Error: ' + err);
            res.redirect('/blogs/' + req.params.id);
        } else {
            res.render('comments/new', {blog: blog});
        }
    });
});

/* Create Comment
*******************/
app.post('/blogs/:id/comments', function(req, res) {
    Blog.findById(req.params.id, function(err, blogPost) {
        if(err) {
            console.log('Error: ' + err);
            res.redirect('/blogs/' + req.params.id);
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log('Error: ' + err);
                    res.redirect('/blogs/' + req.params.id);
                } else {
                    blogPost.comments.push(comment);
                    blogPost.save();
                    res.redirect('/blogs/' + blogPost._id);
                }
            });
        }
    });
});


/* Listening to Server
*****************************************************************/
app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Blog server has started.');
});