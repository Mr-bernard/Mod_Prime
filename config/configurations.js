const cloudinary =require('cloudinary');
const multer = require('multer');
const path = require('path');

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    // cloudinary config
    cloudinary: cloudinary.config({
        cloud_name:'mr-bern',
        api_key: '526717637613853',
        api_secret: 'i04Mc_9pVmOT0MbiousI5ukVfZo'
    }),

    // multer config
    upload: multer({
        storage:multer.diskStorage({
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        }),
        fileFilter: (req, file, cb)=>{
            let ext = path.extname(file.originalname)
            if(ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg"){
                cb(new Error(`File type not supported`), false)
                return
            }
            cb(null, true)
        }
    }),

}
