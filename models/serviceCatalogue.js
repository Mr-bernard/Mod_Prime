const mongoose = require('mongoose')
const {Schema} = mongoose

const servicesCatalogueSchema = new Schema({
  
  servicesImage:{
    type:String,
    required:true
  },
  servicesName:{
    type:String,
    required:true
  },
  servicesCategory:{
    type:String,
    required:true
  }
})

module.exports = {Services: mongoose.model('all-services', servicesCatalogueSchema)}