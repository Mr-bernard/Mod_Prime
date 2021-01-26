const mongoose = require('mongoose')
const {Schema} = mongoose

const projectCatalogueSchema = new Schema({
  projectImage:{
    type:String,
    required:true
  },
  projectName:{
    type:String,
    required:true
  },
  projectDescription:{
    type:String
  }
})

module.exports = {Project: mongoose.model('project', projectCatalogueSchema)}