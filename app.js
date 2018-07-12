var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    campGround  = require("./models/campground"),
    comment     = require("./models/comment"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/vab_camp");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

seedDB();


// --------------------------------------------------------Routes
app.get("/",function(req, res) {
    res.render('home');
});

// -------------------------------------------------View all Campgrounds
app.get("/campgrounds",function(req, res) {
    campGround.find({}, function(err, camp){
        if(err){
            console.log(err);
        }else{
            res.render('index',{location: camp});
        }
    });
});


// ------------------------------------------------Add Campround Form Page
app.get("/campgrounds/new",function(req,res){
    res.render("addcampground");
});


// --------------------------------------------------Post Campground
app.post("/campgrounds",function(req,res){
    var name    = req.body.name,
        image   = req.body.image,
        content = req.body.content;
    var newCampLocation = {name: name, image: image, content: content };
    
    campGround.create(newCampLocation, function(err, campgrounds){
        if(err){
            console.log("ERROR!!");
            console.log(err);
        }else{
            console.log(campgrounds);
            res.redirect("/campgrounds");
        }
    });
});

// -----------------------------------------------Show details page
app.get("/campgrounds/:id", function(req, res) {
   campGround.findById(req.params.id).populate("comments").exec(function(err, camp){
       if(err){
           console.log(err);
       } else{
           console.log(camp);
           res.render("show", {camp: camp});
       }
   }); 
});














app.get("*",function(req,res){
   res.send("Sorry! Try a valid address."); 
});


app.listen(process.env.PORT, process.env.IP);