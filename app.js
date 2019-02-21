var bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();
    
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });

// APP CONFIG
app.set("view engine", "ejs"); // DON'T NEED .ejs FOR THE INDEX PAGE
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Testing",
//     image: "https://www.nps.gov/shen/planyourvisit/images/20170712_A7A9022_nl_Campsites_BMCG_960.jpg?maxwidth=1200&maxheight=1200&autorotate=false",
//     body: "This is a test post"
// });

// RESTFUL ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
    if(err){
        console.log("ERROR!!!");
    } else {
        res.render("index", {blogs: blogs});
    }
    });
});
// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
})


// CREATE ROUTE
app.post("/blogs", function(req, res){
    // TAKE BLOG INFO AND INSERT INTO DATABASE
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs")
        };
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("show", {blog: foundBlog})
        };
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else{
            res.render("edit", {blog: foundBlog});            
        };
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
 // Blog.findByIdAndUpdate(id, newData, callback function)
        if(err){
            res.redirect("/blogs")
        } else{
            res.redirect("/blogs/" + req.params.id)
        };
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    // destory blog
    Blog.findByIdAndRemove(req.params.id, function(err){
 // Blog.findByIdAndRemove(id, callback function)
        if(err){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")
        };
    });
    // redirect somewhere
});

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server is running");
})