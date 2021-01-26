const mongoose = require('mongoose')
const {Schema} = mongoose

const AboutSchema = new Schema({
  
  aboutSide:{
    type:String,
    required:true
  },
  aboutMain:{
    type:String,
    required:true
  },
  aboutHead:{
    type:String,
    required:true
  },
  aboutImage:{
    type:String
  }
})

module.exports = {AboutUs: mongoose.model('aboutMP', AboutSchema)}