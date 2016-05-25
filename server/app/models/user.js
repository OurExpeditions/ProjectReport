// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var passportLocalMongoose = require('passport-local-mongoose');
mongoose.set('debug', true);

var userSchema = new Schema({
    id:String,
    username: String,
    password: String,
    appName:String,
    teamName:String,
    phoneNumber: Number,
    role: String,
    createDate: Date,
    createdBy: String,
    updatedDate:Date,
    updatedBy:String
});

//User.plugin(passportLocalMongoose);

var userModel = mongoose.model('users', userSchema);

module.exports = {
    user: userModel
};