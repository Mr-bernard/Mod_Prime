const mongoose = require('mongoose')
const {Schema} = mongoose

const CEOSchema = new Schema({
  profileImage:{
    type:String,
  },
  ceoName:{
    type:String,
    required:true
  },
  ceoTitle:{
    type:String,
    required:true
  },
  ceoPosition:{
    type:String,
    required:true
  },
  ceoSide:{
    type:String,
    required:true
  },
  ceoMain:{
    type:String,
    required:true
  }
})

module.exports = {AboutCEO: mongoose.model('aboutCEO', CEOSchema)}