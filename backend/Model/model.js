const mongoose = require('mongoose')
const frontData = new mongoose.Schema({
    uid: {
        type: String,
    },
    pic: {
        type: String,
    },
    name: {
        type: String,   
        maxlength: 15,
        minlength: 4
    },
    email: {
        type: String,
    
    },
    username: {
        type: String || Number,
       
    },
    phone: {
        type: Number,
    },
    gender: {
        type: String,
    },
    age: {
        type: Number,
    },
    country: {
        type: String,
    },
    password: {
        type: String,
        
    },
    confirmPassword: {
        type: String
    },
    zip: {
        type: String || Number,
    },
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('SignUp', frontData);