var express = require('express');
// var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var location = [{name:"Location-1", image:"https://www.melrimbagarden.com/sites/default/files/images/DSC04388.JPG"},
                {name:"Location-2", image:"https://media-cdn.tripadvisor.com/media/photo-s/01/87/c4/7d/elkwood-camp-ground.jpg"},
                {name:"Location-3", image:"http://www.visitvictoria.com/-/media/images/high-country/things-to-do/outdoor-activities/camping-falls-to-hotham-alpine-crossing_hc_r_1461477_1150x863.jpg?ts=20151020370426&amp;cp=95&w=480&h=360&crop=1"},
                {name:"Location-4", image:"https://www.melrimbagarden.com/sites/default/files/images/DSC04388.JPG"},
                {name:"Location-5", image:"https://media-cdn.tripadvisor.com/media/photo-s/01/87/c4/7d/elkwood-camp-ground.jpg"},
                {name:"Location-6", image:"http://www.visitvictoria.com/-/media/images/high-country/things-to-do/outdoor-activities/camping-falls-to-hotham-alpine-crossing_hc_r_1461477_1150x863.jpg?ts=20151020370426&amp;cp=95&w=480&h=360&crop=1"},
                {name:"Location-7", image:"https://www.melrimbagarden.com/sites/default/files/images/DSC04388.JPG"},
                {name:"Location-8", image:"https://media-cdn.tripadvisor.com/media/photo-s/01/87/c4/7d/elkwood-camp-ground.jpg"},
                {name:"Location-9", image:"http://www.visitvictoria.com/-/media/images/high-country/things-to-do/outdoor-activities/camping-falls-to-hotham-alpine-crossing_hc_r_1461477_1150x863.jpg?ts=20151020370426&amp;cp=95&w=480&h=360&crop=1"},
                {name:"Location-10", image:"https://www.melrimbagarden.com/sites/default/files/images/DSC04388.JPG"},
                {name:"Location-11", image:"https://media-cdn.tripadvisor.com/media/photo-s/01/87/c4/7d/elkwood-camp-ground.jpg"},
                {name:"Location-12", image:"http://www.visitvictoria.com/-/media/images/high-country/things-to-do/outdoor-activities/camping-falls-to-hotham-alpine-crossing_hc_r_1461477_1150x863.jpg?ts=20151020370426&amp;cp=95&w=480&h=360&crop=1"}];
                    

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",function(req, res) {
    res.render('home');
});


app.get("/campgrounds",function(req, res) {
    res.render('campgrounds',{location: location});
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampLocation = {name: name, image: image};
    location.push(newCampLocation);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
    res.render("addcampground");
});





app.get("*",function(req,res){
   res.send("Sorry! Try a valid address."); 
});


app.listen(process.env.PORT, process.env.IP);