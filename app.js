var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
	 methodOverride  = require("method-override"),
    app             = express();

mongoose.connect("mongodb://localhost:27017/blog_app",{
   useNewUrlParser: true,
   useUnifiedTopology: true,
});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

app.get("/",function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    //Retrieve or find all blogs from DB
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: allBlogs});
        }
    });
});

// route for going to form page to add new blog
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//create new blog
app.post("/blogs", function(req, res){
	// var title = req.body.blog.title;
	// var image = req.body.blog.image;
	// var body = req.body.blog.body;
	// var newBlog = {title: title, image: image, body: body};
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log(err);
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

// show more info about a particular blog
app.get("/blogs/:id", function(req, res){
	Blog.find({_id: req.params.id}, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

// show form to edit a particular blog
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// update blog
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// delete blog
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.listen(2000, function(){
    console.log("Your server is running!");
});
