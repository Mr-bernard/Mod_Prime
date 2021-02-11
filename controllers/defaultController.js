const {Project} = require('../models/projectCatalogue')
const {Services} = require('../models/serviceCatalogue')
const {whatWeDo} = require('../models/servicesAbout')
const {AboutUs} = require('../models/aboutModelPrime')
const {AboutCEO} = require('../models/aboutCEO')
const {Admin} = require('../models/admin')
const {Home} = require('../models/home')
const aboutCEO = require('../models/aboutCEO')


module.exports = {
    indexGet : async(req,res)=>{
    const home = await Home.find({})
    let recentHome = home[home.length-1]
    res.render('index', {recentHome})
    },

    aboutGet : (req,res)=>{
        Admin.find({}).then((admin) => {
        AboutUs.find({}).then((aboutUs)=>{
            let recentAbout = aboutUs[aboutUs.length-1]
            let image = admin[0].avatar;
            res.render('about', {image, recentAbout})
        })
        .catch(err=>console.log(err))
        })
    .catch(err=>console.log(err))
    },


    serviceGet : (req,res)=>{
            Services.find({$or:[{servicesCategory:"security"}, {servicesCategory:"architecture"}, {servicesCategory:"interior"}, {servicesCategory:"engineering"}]})
        .then((categories)=>{
            // console.log(categories)
            whatWeDo.find({})
            .then((about)=>{
                let newestAbout = about[about.length-1]
                 let security = categories.filter((securities)=>{
                    return securities.servicesCategory === "security"
                })
                let architecture = categories.filter((archi)=>{
                    return archi.servicesCategory === "architecture"
                })
                let interior = categories.filter((interiorDeco)=>{
                    return interiorDeco.servicesCategory === "interior"
                })
                let engineering = categories.filter((engine)=>{
                    return engine.servicesCategory === "engineering"
                })
        res.render('services', {security,architecture,interior, engineering, newestAbout})


            })
               
        })
        .catch(err=>console.log(err))
    },


    projectGet : (req,res)=>{
        const projects = Project.find({})
        projects.exec((err, projects)=>{
            if(err) throw err
            else{
                console.log(projects)
            }
            res.render('project', {projects})
        })
    },



    principalGet : (req,res)=>{
        Admin.find({}).then((admin) => {
         AboutCEO.find({}).then((ceo)=>{
            //  console.log(ceo)
            let recentCeo = ceo[ceo.length-1]
            let image = admin[0].avatar;
            res.render('principal', {image, recentCeo})
         })
        })
        
    },


    contactGet : (req,res)=>{
        res.render('contact', {message: req.flash('message')})
    },

}