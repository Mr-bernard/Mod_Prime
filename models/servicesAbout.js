const mongoose = require('mongoose')
const {Schema} = mongoose

const servicesAboutSchema = new Schema({
  
  servicesAbout:{
    type:String,
    required:true
  }
})

module.exports = {whatWeDo: mongoose.model('what-we-do', servicesAboutSchema)}