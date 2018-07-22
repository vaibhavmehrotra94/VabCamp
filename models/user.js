"use strict";
var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");
    
    
var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    firstname: String,
    lastname: String,
    password: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);