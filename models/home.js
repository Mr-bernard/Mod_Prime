const mongoose = require('mongoose')
const {Schema} = mongoose

const homeSchema = new Schema({
  
  homeSide:{
    type:String,
    required:true
  },
  homeMain:{
    type:String,
    // required:true
  },
  homeHead:{
    type:String,
    required:true
  },
  homeImage:{
    type:String
  },
  vision:{
    type: String,
    required: true
  },
  mission:{
    type: String,
    required: true
  }
})

module.exports = {Home: mongoose.model('home', homeSchema)}